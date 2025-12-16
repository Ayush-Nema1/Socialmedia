import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./reducer/authreducer";

export  const store = configureStore({
    reducer:{
     auth:   authreducer
    }
    })
