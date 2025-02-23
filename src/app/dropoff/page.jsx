"use client";


import DropOffTable from "@/components/table/DropOffTable";
import React from 'react'
import useTableDataApi from "@/customHooks/useTableDataApi";

const Dropoff = () => {

  const {data:dropoffData,loading,error} = useTableDataApi("drop")

  return (
   <>
    <DropOffTable dropoffData={dropoffData} loading={loading} error={error}/>
   </>
  )
}

export default Dropoff;


