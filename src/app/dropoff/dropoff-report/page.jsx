"use client";
import React from 'react'
import DropOffReport from '@/components/report/DropOffReport';
import useTableDataApi from '@/customHooks/useTableDataApi';

function ReportPage() {


  const {data:dropoffData,loading,error} = useTableDataApi("drop")

  console.log("useTableDataApi",dropoffData,loading,error)
  
  return (
   <>
      <DropOffReport dropoffData={dropoffData} loading={loading} error={error} />

    </>
  )
}

export default ReportPage