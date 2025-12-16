import {  useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import Userlayout from '@/layout/userlayout';
import { registerUser } from '@/config/redux/action/authAction';

function Login() {
  const router = useRouter();
const authState = useSelector((state)=> state.auth)
const dispatch  = useDispatch();

const[logged,setlogged] = useState(false);
const[email,setemail] = useState("");
const[password,setpassword] = useState("");
const[name,setName]=useState("");
const[username,setusername] = useState("");



useEffect(()=>{
  if(authState.isloggedIn){
    router.push('/dashboard');
  }
})

const handleLogin=()=>{
console.log("i am login")
}
const handleReister =()=>{
  dispatch(registerUser({username,password,email,name}));
  console.log("click")
}

  return (

    <Userlayout>
      <div className={styles.container}>
        <div className={styles.box}>
        <p >{logged ? "SignIn" : "SignUp"} </p>

        <p style={{color: authState.isError ? "red" : "green"}}>{authState.message}</p>

        <div className={styles.row}>
          <input onChange={(e)=> setusername(e.target.value)} type="text" placeholder='Username' className={styles.row1}/>
          <input onChange={(e)=> setName(e.target.value)} type="text" placeholder='Name' className={styles.row1}/>
        </div>
       
          <input  onChange={(e)=> setemail(e.target.value)} type="text" placeholder='email' className={styles.row1}/>
          <input  onChange={(e)=> setpassword(e.target.value)} type="password" placeholder='password' className={styles.row1}/>
           <button onClick={()=>{
            if(logged){
              handleLogin();
            }else{
              handleReister();
            }
           }} className={styles.btnofform}>SignUp</button>
        </div>
      </div>
    </Userlayout>
  )
}

export default Login