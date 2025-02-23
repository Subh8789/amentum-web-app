// hooks/useSearchApi.js
import { useState} from 'react';
import { useRouter } from 'next/navigation';

const useSearchApi = (trackingCode) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const POST_KEY = process.env.NEXT_PUBLIC_POST_KEY;
  const API_URL = `${BASE_URL}/api/v1/waybill/track/appointments/search`;

  const fetchTrackingData = async (trackingCode) => {
    if (!trackingCode) return;
    
    setLoading(true);
    setError(null);

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("post-key", POST_KEY);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(
        `${API_URL}?search=${trackingCode}`, 
        requestOptions
      );
      const data = await response.json();
      
      if (data.responseCode === 200 && data.success) {
        setFormData(data.data);
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch tracking data. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setError(null);
    router.push("/dropoff");
  };

  return {
    formData,
    loading,
    error,
    fetchTrackingData,
    handleOnClose
  };
};

export default useSearchApi;

