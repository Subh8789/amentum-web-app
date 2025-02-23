// useTableDataApi.js
import { useState, useEffect } from 'react';

const useTableDataApi = (type) => {
    console.log("type",type);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const POST_KEY = process.env.NEXT_PUBLIC_POST_KEY;
  const GET_APPOINTMENT_DROP = `${BASE_URL}/api/v1/waybill/track/appointments`;

  useEffect(() => {
    const fetchData = async () => {
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
        const response = await fetch(`${GET_APPOINTMENT_DROP}?type=${type}`, requestOptions);
        const result = await response.json();
        
        if (result.responseCode === 200 && result.success) {
          setData(result?.data?.data);
        } else {
          setError("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, BASE_URL, POST_KEY]);

  return { data, loading, error };
};

export default useTableDataApi;

// // Example usage in a component:
// // DropoffPage.js
// import useReportsApi from './hooks/useReportsApi';

// const DropoffPage = () => {
//   const { data: dropoffData, loading, error } = useReportsApi('drop');

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       {/* Render your dropoff data here */}
//       {dropoffData.map((item) => (
//         <div key={item.id}>
//           {/* Your dropoff item content */}
//         </div>
//       ))}
//     </div>
//   );
// };

// // You can also use it for different types:
// // PickupPage.js
// const PickupPage = () => {
//   const { data: pickupData, loading, error } = useReportsApi('pickup');
  
//   // Rest of your component code
// };