"use client";

import React from 'react'
import PickupTable from '@/components/table/PickupTable';
import useTableDataApi from '@/customHooks/useTableDataApi';

const Pickup = () => {

  const {data:pickupData,loading,error} = useTableDataApi("pick")

  return (
   <>
    <PickupTable pickupData={pickupData} loading={loading} error={error} />
   </>
  )
}

export default Pickup;


