"use client";
import React from 'react'
import OfficerReportOis from '@/components/report/OfficerReportOis';
import useTableDataApi from '@/customHooks/useTableDataApi';

function OfficerReportPage() {

  const {data:dropoffData,loading,error} = useTableDataApi("drop")

  console.log("useTableDataApi-underois report",dropoffData,loading,error)

  return (
   <>
      <OfficerReportOis dropoffData={dropoffData} loading={loading} error={error} />
    </>
  )
}

export default OfficerReportPage