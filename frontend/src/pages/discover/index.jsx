import { base_URL } from '@/config';
import { getAllUser } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardlayout'
import Userlayout from '@/layout/userlayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { useRouter } from 'next/router';
export default function Discover() {
  const dispatch = useDispatch();
 const authState = useSelector((state) =>state.auth)
 const router = useRouter()
  useEffect(()=>{
     if(!authState.all_profiles_fetched){
        dispatch(getAllUser());
     }
  },[]);  
    return (

   <Userlayout>
    <DashboardLayout>
        <div>
      <h1>Discover</h1>
      <div className={styles.alluserProfile}>
        {authState.all_profiles_fetched && authState.all_users?.profiles?.map((user)=>{
         return(
          <div onClick={()=>{
            router.push(`/view_profile/${user.userId.username}`)
          }} key={user._id} className={styles.userCard}>
            <img src={`${base_URL}/${user.userId.profilePicture}`} alt="profilepic" />
            <div>
            <h1>{user.userId.name}</h1>
            <p>{user.userId.username}</p>
            </div>
          </div>
         ) 
        })}
      </div>
      </div>
    </DashboardLayout>
   </Userlayout>
  )
}
