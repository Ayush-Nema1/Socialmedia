import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
function Navbar() {
  const router = useRouter();
  return (
    <div className={styles.container}>
        <nav className={styles.navBar}>
          <h1 onClick={()=>{
            router.push('/')
          }} style={{cursor:"pointer"}}>Proconnect</h1>
        <div className={styles.navBarright}>
          <div onClick={()=>{
            router.push('/login')
          }} className = {styles.btn}>
            <p style={{cursor:"pointer"}}>Be a part</p>
          </div>
        </div>
        </nav>
        
    </div>
  )
}

export default Navbar