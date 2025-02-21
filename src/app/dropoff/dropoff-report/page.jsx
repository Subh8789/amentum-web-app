"use client";
import React from 'react'
import DropOffReport from '@/components/report/DropOffReport';

import { useState,useEffect } from 'react';

function ReportPage() {
 const [dropoffData,setDropoffData] = useState([])
   const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const POST_KEY = process.env.NEXT_PUBLIC_POST_KEY
    const GET_APPOINTMENT_DROP = `${BASE_URL}/api/v1/waybill/track/appointments`;
  
  
    useEffect(() => {

       console.log("under dropoff page")
        const fetchDropOffData = async () => {
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
            const response = await fetch(`${GET_APPOINTMENT_DROP}?type=drop`, requestOptions);
            const data = await response.json();
            if (data.responseCode === 200 && data.success) {
              setDropoffData(data?.data?.data);
            } else {
              setError("No data found ");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch dropoff data. Please try again.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchDropOffData();
      }, []);
  

  return (
   <>
      <DropOffReport dropoffData={dropoffData} loading={loading} error={error} />

    </>
  )
}

export default ReportPage