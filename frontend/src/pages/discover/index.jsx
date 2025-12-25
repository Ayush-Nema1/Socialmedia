import { getAllUser } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardlayout'
import Userlayout from '@/layout/userlayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Discover() {
  const dispatch = useDispatch();
 const authState = useSelector((state) =>state.auth)
  useEffect(()=>{
     if(!authState.all_profiles_fetched){
        dispatch(getAllUser());
     }
  },[]);  
    return (

   <Userlayout>
    <DashboardLayout>
        <div>
      <h1>discover</h1>
      </div>
    </DashboardLayout>
   </Userlayout>
  )
}
