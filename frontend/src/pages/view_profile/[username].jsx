import { base_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/dashboardlayout';
import Userlayout from '@/layout/userlayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getConnectionRequest,getMyConnectionRequests,sendConnectionRequest } from '@/config/redux/action/authAction';




export default function Viewprofile({userProfile}) {
const dispatch = useDispatch();

const router = useRouter();
const postReducer = useSelector((state)=>state.posts);
const authState = useSelector((state) => state.auth)

const [userPosts,setuserPosts] = useState([]);

const[isCurrentUserInconnection,setisCurrentUserInconnection] = useState(false);
const[isConnectionnull,setisCurrentUserInconnectionnull] = useState(false)


useEffect(() => {
  getUserPost();
}, []);


const getUserPost = async()=>{
  await dispatch(getAllPosts());
  await dispatch(getConnectionRequest({token:localStorage.getItem("token")}));
  await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
}

useEffect(()=>{
  let post = postReducer.posts.filter((post)=>{
    return post.userId.username === router.query.username
  })
  setuserPosts(post);
},[postReducer.posts])
 
useEffect(()=>{


console.log(authState.connections, userProfile.userId._id)
if(authState.connections.some(user=>user.connectionId._id === userProfile.userId._id)){
  setisCurrentUserInconnection(true)

  if(authState.connections.find(user=>user.connectionId._id === userProfile.userId._id).status_accepted === true){
    setisCurrentUserInconnectionnull(false);
  }

}
if(authState.connectionRequest.some(user=>user.userId._id === userProfile.userId._id)){
  setisCurrentUserInconnection(true)

  if(authState.connectionRequest.find(user=>user.userId._id === userProfile.userId._id).status_accepted === true){
    setisCurrentUserInconnectionnull(false);
  }

}
},[authState.connections,authState.connectionRequest])

    return (
      <Userlayout>
      <DashboardLayout>   
        <div className={styles.userProifileContainer}>
         <div className={styles.backDropContainer}>
          <img src={userProfile?.userId?.profilePicture} />
         </div>

         <div className={styles.profileContainer_details}>
          <div style= {{display:"flex",gap:"0.7rem"}}>
            <div style={{flex:"0.8"}}>
              <div style={{display:"flex",width:"fit-content",alignItems:"center", gap:"1.2rem"}}>
              <h2>{userProfile.userId.name}</h2>
              <p style={{color:"gray"}}>@{userProfile.userId.username}</p>
              </div>

            <div style={{display: "flex" , alignItems: "center" ,gap :"1.2rem" , marginTop: "1.2rem" }} >

            
              {isCurrentUserInconnection ? <button className={styles.connetbtn} > {isConnectionnull ? "Pending" : "connected " }   </button> : <button className={styles.connetbtn} onClick={()=>{
              dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id: userProfile.userId._id}))
              setisCurrentUserInconnection(true);
              setisCurrentUserInconnectionnull(true);
               
             }}> connect </button>
            }

            <div style={{cursor:"pointer"}}    onClick = {async()=>{
             // const response = await clientServer.get(`/user/dowmload_resume?id=${userProfile.userId._id}`);
            window.open(
  `${base_URL}/user/dowmload_resume?id=${userProfile.userId._id}`,"_blank");

            }}>
              
              <svg style={{width:"1.2rem"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
</div>
            
            </div>
            
             
            </div>
            <div style={{flex:"0.2"}}>
               <h3>Recent Activity</h3>
               {userPosts.map((post)=>{
                return(
                  <div key = {post._id} className={styles.postcard}>
                    <div className={styles.card}>
                      <div className={styles.card_profilecontainer}>
{post.media 
 ? <img src={`${base_URL}/uploads/${post.media}`} />
 : <div style={{width:"3.4rem",height:"3.4rem"}}></div>
}
                      </div>
                      <p style={{fontSize:"small"}} >{post.body}</p>
                      </div>
                      </div>
                )
               })}
            </div>
          </div>
         </div>

         <div className="userWorkHistry">
         <h4>Work History</h4>
         <div className={styles.wrokhistorycontainer}>
          {
            userProfile.pastWork.map((work,index)=>{
              return(
                <div key={index} className={styles.workHistoryCArd}>
                 <p style={{fontWeight:"bold",display: "flex",alignItems:"center" ,gap:"0.8rem"}}> {work.company} - {work.position} </p>
                  <p> {work.years} </p>
                  </div>
                )
            })
          }
      
          
         </div>
         </div>
        </div>

       
  </DashboardLayout>
  </Userlayout>

  )
}

export async function getServerSideProps(context) {
  console.log("from view")
  
  //  const { username } = context.params; 
  
  const request = await clientServer.get("/user/get_profile_basedonusername",
   { params:{
      username: context.query.username
    }

  }  )
  const data = await request.data
  console.log(data)
  return{props : {userProfile : request.data.profile}}
  }
