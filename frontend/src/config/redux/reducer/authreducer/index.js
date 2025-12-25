import { getAboutUser, getAllUser, loginUser, registerUser } from "../../action/authAction"
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    user:null,
    isError: false,
    isSuccess : false,
    isLoading:false,
    isloggedIn: false,
    isTokenthere:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched:false

}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset: ()=> initialState,
        handleLoginUser :(state)=>{
            state.message = "hello"
        },
        emptymessage:(state)=>{
            state.message = ""
        },
        setTokenisthere:(state)=>{
            state.isTokenthere = true
        },
        setTokenisnotthere:(state)=>{
            state.isTokenthere = false
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
            state.isSuccess = false,
            state.isloggedIn = false,
            state.message = action.payload
        })
        .addCase(registerUser.pending,(state,action)=>{
           state.isLoading = true,
           state.message = "knocking the door"
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError = false,

            state.message = "Please login"
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError = true,

            state.message = action.payload
        })
        .addCase(getAboutUser.fulfilled , (state,action)=>{
            state.isLoading = false;
            state.isError  = false;
            state.profileFetched= true;
            state.user = action.payload;
            
        })
        .addCase(getAllUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload
        })
    }
})
export const {reset,emptymessage,setTokenisthere,setTokenisnotthere} = authSlice.actions;
export default authSlice.reducer