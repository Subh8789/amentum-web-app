"use client";
import React from 'react'
import { useState,useEffect } from 'react';
import OfficerReportDhl from '@/components/report/OfficerReportDhl';
import useTableDataApi from '@/customHooks/useTableDataApi';

function OfficerReportPage() {

  const {data:dropoffData,loading,error} = useTableDataApi("drop")

  console.log("useTableDataApi-underdhl report",dropoffData,loading,error)
  
  return (
   <>
      <OfficerReportDhl dropoffData={dropoffData} loading={loading} error={error} />
    </>
  )
}

export default OfficerReportPage