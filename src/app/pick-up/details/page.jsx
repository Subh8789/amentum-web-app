//import TableWithHeader from '@/components/TableWithHeader';
"use client";
import { useState,useEffect } from 'react';
import TrackingForm from '@/components/TrackingForm';
import React from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import DisabledForm from '@/components/DisabledForm';



const LoadingModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="loading-spinner"></div>
        <p>Processing your request...</p>
      </div>
    </div>
  );
  
  const ErrorModal = ({ message, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="error-title">Error</h3>
        <p className="error-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

const ApplicationDetail = () => {
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get("trackingCode");

  const router=useRouter();


  const [formData, setFormData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
  
  
      const BASE_URL = "https://app.swglobalstaging.com";
  
      const POST_KEY = "f11e8d98b515c1d53290f3811bd01e5a2416a9315a8974d69cd939a1fce6b253"
      const API_URL = `${BASE_URL}/api/v1/waybill/track/appointments/search`;
  

      useEffect(() => {
          const fetchTrackingData = async () => {
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
                  const response = await fetch(`${API_URL}?search=${trackingCode}`, requestOptions);
                  const data = await response.json();
                  if (data.responseCode === 200 && data.success) {
                      setFormData(data.data);
                  } else {
                      setError(data.message);
                  }
              } catch (error) {
                  console.error("Error fetching data:", error);
                  setError("Failed to fetch tracking data. Please try again.");
              } finally {
                  setLoading(false);
              }
          };
  
          fetchTrackingData();
      }, [trackingCode]);
  
    function handleOnClose(){
        setError(null);
        if (error)
          router.push("/dropoff");
    }

  return (

<>
{loading && <LoadingModal />}
      {error && <ErrorModal message={error} onClose={() => handleOnClose()} />}
      
      {!loading && !error && formData && (
   <div style={{"marginBottom": "20%"}}>
   {
     formData && formData.status == "Appointment booked" ? 
      <TrackingForm formData={formData} loader={loading} errMsg={error}/>
      :<DisabledForm formData={formData} loader={loading} errMsg={error}/>
   }
 
        
 
     </div>
      )}

</>

 
  )
}

export default ApplicationDetail;
