import { loginUser, registerUser } from "../../action/authAction"
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    user:[],
    isError: false,
    isSuccess : false,
    isLoading:false,
    isloggedIn: false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[]
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset: ()=> initialState,
        handleLoginUser :(state)=>{
            state.message = "hello"
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.isLoading = true,
            state.message = "knocking the door"
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = true,
            state.isloggedIn = true,
            state.message = "logged In"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError = true,
            state.isSuccess = true,
            state.isloggedIn = true,
            state.message = action.payload
        })
        .addCase(registerUser.pending,(state,action)=>{
           state.isLoading = true,
           state.message = "knocking the door"
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError = false,

            state.message = "singn In"
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError = true,

            state.message = action.payload
        })
    }
})
export default authSlice.reducer