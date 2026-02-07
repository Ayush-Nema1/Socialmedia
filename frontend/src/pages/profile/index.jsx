import { getAboutUser } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/dashboardlayout'
import Userlayout from '@/layout/userlayout'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { base_URL } from '@/config';

export default function Profilepage() {

   const authState = useSelector((state)=>state.auth);
const postReducer = useSelector((state)=>state.posts);

   const [userProfile, setUserProfile] = useState({});

   const [userPosts , setuserPosts] = useState([]);

   const dispatch = useDispatch();

   useEffect(()=>{
   dispatch(getAboutUser({token : localStorage.getItem("token")}));
   },[])

   useEffect(()=>{
    setUserProfile(authState.user)
   },[authState.user])

   useEffect(()=>{
     let post = postReducer.posts.filter((post)=>{
       return post.userId.username === router.query.username
     })
     setuserPosts(post);
   },[postReducer.posts])

  return (
   <Userlayout>
    <DashboardLayout>

      {authState.user && 
          <div className={styles.userProifileContainer}>
         <div className={styles.backDropContainer}>
          <img src={`${base_URL}/${userProfile?.userId?.profilePicture}`} alt="" />
         </div>

         <div className={styles.profileContainer_details}>
          <div style= {{display:"flex",gap:"0.7rem"}}>
            <div style={{flex:"0.8"}}>
              <div style={{display:"flex",width:"fit-content",alignItems:"center", gap:"1.2rem"}}>
              <h2>{userProfile?.userId?.name}</h2>
              <p style={{color:"gray"}}>@{userProfile?.userId?.username}</p>
              </div>

            <div style={{display: "flex" , alignItems: "center" ,gap :"1.2rem" , marginTop: "1.2rem" }} >

            
           

            
            </div>
            
             
            </div>
            <div style={{flex:"0.2"}}>
               <h3>Recent Activity</h3>
               {userPosts?.map((post)=>{
                return(
                  <div key = {post._id} className={styles.postcard}>
                    <div className={styles.card}>
                      <div className={styles.card_profilecontainer}>
{post.media 
 ? <img src={`${base_URL}/uploads/${post.media}`} />
 : <div style={{width:"3.4rem",height:"3.4rem"}}></div>
}
                      </div>
                      <p style={{fontSize:"small"}} >{post?.body}</p>
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
            userProfile?.pastWork?.map((work,index)=>{
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
}
    </DashboardLayout>
   </Userlayout>
  )
}
