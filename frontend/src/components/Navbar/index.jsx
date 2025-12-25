import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authreducer";

function Navbar() {
  const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
 
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          onClick={() => {
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        >
          Proconnect
        </h1>

        <div className={styles.navBarright}>
          {user ? (
          <div style={{ display: "flex", flexDirection: "row", gap: "20px",flexWrap: "nowrap",cursor:"pointer" }}>
            
                <p style={{fontSize:"1.3rem",pointer:"cursor"}}>Hey, {user.userId?.name}</p>
                <p style={{ fontWeight: "bold",fontSize:"1.2rem" }}>Profile</p>
              
              
                <p onClick={()=>{
                  localStorage.removeItem('token');
                  router.push('/login')
                  dispatch(reset());
                }} style={{ fontWeight: "bold",fontSize:"1.2rem",pointer:"cursor" }}>Logout</p>
              
            </div>
          
        ) : (
          <div
            onClick={() => router.push("/login")}
            className={styles.btn}
          >
            <p>Be a part</p>
          </div>
        )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
