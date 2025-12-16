import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import App from "./_app";
import { useRouter } from "next/router";
import Userlayout from "@/layout/userlayout";



export default function Home() {
  const router = useRouter();
  return (
    <Userlayout>
    
    <div className={styles.container}>
      <div className={styles.maincontainer}>
        <div className={styles.contanerleft}>
         <p>Connect with friends without Exaggeration </p>
         <p>A social platform built on real stories, no exaggeration</p>
         
          <div onClick={()=>{
            router.push('/login');
          }} className={styles.buttonjoin}>
            <p>Join Now</p>
          </div>
        </div>
        <div className={styles.containerright}>
           <img src="img.png" alt="" style={{height:"30vh"}} />
        </div>
      </div>
    </div>
    </Userlayout>
  );
}
