"use client";

import { useState,useEffect } from 'react';
import DropOffTable from "@/components/table/DropOffTable";
import React from 'react'

const Dropoff = () => {

   const [dropoffData,setDropoffData] = useState([])
   const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
    const BASE_URL = "https://app.swglobalstaging.com";
    const POST_KEY = "f11e8d98b515c1d53290f3811bd01e5a2416a9315a8974d69cd939a1fce6b253"
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
    <DropOffTable dropoffData={dropoffData} loading={loading} error={error}/>
   </>
  )
}

export default Dropoff;


