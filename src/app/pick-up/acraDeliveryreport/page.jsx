"use client";
import React from 'react'
import AcraDeliveryReport from '@/components/report/AcraDeliveryReport';
import useTableDataApi from '@/customHooks/useTableDataApi';

function AcraDelivery() {
  
  const {data:pickupData,loading,error} = useTableDataApi("pick")

  console.log("useTableDataApi-underpickup-Acra-report",pickupData,loading,error)

  return (
   <>
      <AcraDeliveryReport pickupData={pickupData} loading={loading} error={error} />
    </>
  )
}

export default AcraDelivery