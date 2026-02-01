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





export default function Viewprofile({userProfile}) {
const dispatch = useDispatch();

const router = useRouter();
const postReducer = useSelector((state)=>state.posts);
const authState = useSelector((state) => state.auth)

const [userPosts,setuserPosts] = useState([]);

const[isCurrentUserInconnection,setisCurrentUserInconnection] = useState(false);

useEffect(() => {
  getUserPost();
}, []);


const getUserPost = async()=>{
  await dispatch(getAllPosts());
  await dispatch(getConnectionRequest({token:localStorage.getItem("token")}));
}

useEffect(()=>{
  let post = postReducer.posts.filter((post)=>{
    return post.userId.username === router.query.username
  })
  setuserPosts(post);
},[postReducer.posts])
 
useEffect(()=>{
console.log(authState.connections, userProfile.userId._id)
if(authState.connections.some(user=>user.connectionId_.id === userProfile.userId._id)){
  setisCurrentUserInconnection(true)
}
},[authState.connections])

    return (
      <Userlayout>
      <DashboardLayout>   
        <div className={styles.userProifileContainer}>
         <div className={styles.backDropContainer}>
          <img src={`${base_URL}/${userProfile.userId.profilePicture}`} alt="" />
         </div>

         <div className={styles.profileContainer_details}>
          <div style= {{display:"flex",gap:"0.7rem"}}>
            <div style={{flex:"0.8"}}>
              <div style={{display:"flex",width:"fit-content",alignItems:"center", gap:"1.2rem"}}>
              <h2>{userProfile.userId.name}</h2>
              <p style={{color:"gray"}}>@{userProfile.userId.username}</p>
              </div>
              {isCurrentUserInconnection ? <button className={styles.connetbtn}>connected </button>: <button className={styles.connetbtn} onClick={()=>{
              dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id: userProfile.userId._id}))
             }}></button>
            }
            <div>
              <p>{userProfile.bio}</p>
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
 ? <img src={`${base_URL}/${post.media}`} alt="img" />
 : <div style={{width:"3.4rem",height:"3.4rem"}}></div>
}
                      </div>
                      <p>{post.body}</p>
                      </div>
                      </div>
                )
               })}
            </div>
          </div>
         </div>
        </div>

         <div>{userProfile.userId.username}</div>
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
