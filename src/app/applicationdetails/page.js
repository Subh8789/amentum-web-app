"use client";
import DisabledForm from '@/components/DisabledForm';
import TrackingForm from '@/components/TrackingForm';
import React from 'react';
import "./applicationDetails.css"
import { useRouter } from 'next/navigation';
import DisabledFormPickup from '@/components/forms/DisabledFormPickup';
import EnabledFormPickup from '@/components/forms/EnabledFormPickup';

import { useState,useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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


function page() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const searchParams = useSearchParams();
    const trackingCode = searchParams.get("trackingCode");
    
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const POST_KEY = process.env.NEXT_PUBLIC_POST_KEY
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
        router.push("/dropoff");
    }
  return (
    <>
    {loading && <LoadingModal />}
      {error && <ErrorModal message={error} onClose={() => handleOnClose()} />}
      
    {/* {
        formData && formData.status == "Appointment booked" ?
        <TrackingForm formData={formData} />
        :
        <DisabledForm formData={formData}/>
    } */}

{/* {formData && formData.status 
        ? formData.status.includes("Appointment booked") 
          ? <TrackingForm formData={formData} />
          : formData.status.includes("Dropped") 
            ? <DisabledForm formData={formData} />
            : <DisabledFormPickup formData={formData} />
        : <DisabledFormPickup formData={formData} />
      } */}

{/* {formData && (
  formData.status.includes("Dropped") ? (
    <DisabledForm formData={formData} />
  ) : formData.type === "drop" && formData.status === "Appointment booked" ? (
    <TrackingForm formData={formData} />
  ) : formData.type === "pick" && formData.status === "Appointment booked" ? (
    <DisabledFormPickup formData={formData} />
  ) : null
)} */}

{formData && (
  formData.status.includes("Dropped") ? (
    <DisabledForm formData={formData} />
  ) : formData.type === "drop" && formData.status === "Appointment booked" ? (
    <TrackingForm formData={formData} />
  ) : formData.type === "pick" && formData.status === "Appointment booked" ? (
    <EnabledFormPickup formData={formData} />
  ) : formData.type === "pick" && formData.status !== "Appointment booked" ? (
    <DisabledFormPickup formData={formData} />
  ) : null
)}
    </>
  )
}

export default page