import { useState } from 'react';

const useReportDownloader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadReport = async ({ startDate, endDate, type, service, user }) => {

    console.log("dhlreportdwnld",startDate, endDate, type, service, user);
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const POST_KEY = process.env.NEXT_PUBLIC_POST_KEY;

      const apiUrl = `${BASE_URL}/api/v1/waybill/track/report?type=${type}&startDate=${startDate}&endDate=${endDate}&service=${service}&user=${user}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "post-key": POST_KEY,
        },
      });

      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.location.href = url;
      URL.revokeObjectURL(url);

      alert("Report downloaded successfully.");
      return true;

    } catch (error) {
      console.error("Error downloading report:", error);
      setError(error.message);
      alert("Failed to download the report. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadReport,
    isLoading,
    error
  };
};

export default useReportDownloader;