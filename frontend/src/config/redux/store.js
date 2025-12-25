import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./reducer/authreducer";
import postReducer from "./reducer/postreducer"

export  const store = configureStore({
    reducer:{
     auth:   authreducer,
     posts: postReducer,
    }
    })
