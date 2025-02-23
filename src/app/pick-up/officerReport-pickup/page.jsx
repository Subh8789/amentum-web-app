"use client";
import React from 'react'
import OfficerReportPickup from '@/components/report/OfficerReportPickup';
import useTableDataApi from '@/customHooks/useTableDataApi';

function PickupOfficerReport() {

  const {data:pickupData,loading,error} = useTableDataApi("pick")

  console.log("useTableDataApi-underOfficedrreport-pickup",pickupData,loading,error)
 
  return (
   <>
      <OfficerReportPickup pickupData={pickupData} loading={loading} error={error} />
    </>
  )
}

export default PickupOfficerReport