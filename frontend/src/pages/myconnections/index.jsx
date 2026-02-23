import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardlayout'
import Userlayout from '@/layout/userlayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { base_URL } from '@/config';
import { useRouter } from 'next/router';
import { connection } from 'next/server';

export default function Myconnection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state)=> state.auth)
  useEffect(()=>{
     console.log("profile==");



     dispatch(getMyConnectionRequests({
      token:localStorage.getItem("token")
    }));
  },[]);

  useEffect(()=>{
    if(authState.connectionRequest.length != 0 ){
      console.log(authState.connectionRequest);
    }
  },[authState.connectionRequest])
  
  return (
    <Userlayout>
    <DashboardLayout>
      <div style={{display:"flex" , flexDirection:"column",gap:"1.7rem"}} >
      <h1>My Connections</h1>
       {authState.connectionRequest.length === 0 && <h3>No coonection request pending</h3> }

       {authState.connectionRequest !== 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user)=>{
        return (
          
          <div onClick={()=>{
            router.push(`/view_profile/${user.userId.username}`)
          }} key ={user._id} className={styles.usercard}  >
             <div style={{display:"flex" , alignItems: "center",gap:"1.2rem",justifyContent:"space-between"}}>
             <div className={styles.profilepicture}>
              {console.log("hiiiiii")}
              {console.log(user.userId.profilePicture)}

              
              <img src={`${base_URL}/uploads/${user.userId.profilePicture}`} alt="img" />
           </div>
             <div className={styles.userInfo} >
               <h3>{user.userId.name} </h3>
               <p> {user.userId.username } </p>
             </div>
             <button onClick={(e)=>{
              e.stopPropagation();

              dispatch(AcceptConnection({
                connectionId: user._id,
                token: localStorage.getItem(('token')),
                
              }))
             }} className={styles.acceptbtn}> Accept </button>
               </div>
          </div>
        )
       })}

       <h3>My Network</h3>
         { authState.connectionRequest.filter((connection)=> connection.status_accepted !== null).map((user,index)=>{
             return(
             <div onClick={()=>{
            router.push(`/view_profile/${user.userId.username}`)
          }} key ={index} className={styles.usercard}  >
             <div style={{display:"flex" , alignItems: "center",gap:"1.2rem",justifyContent:"space-between"}}>
             <div className={styles.profilepicture}>
               {console.log(user.userId.profilePicture)}
              <img src={user.userId.profilePicture} />
           </div>
             <div className={styles.userInfo} >
               <h3>{user.userId.name} </h3>
               <p> {user.userId.username } </p>
             </div>
            
               </div>
          </div>
             )
          })}
          </div>
    </DashboardLayout>
   </Userlayout>
  )
}
