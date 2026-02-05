import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async(user,thunkAPI)=>{
        try {
            const response = await clientServer.post('/login',{
                email: user.email,
                password:user.password
            });
            if(response.data.token){
            localStorage.setItem("token",response.data.token)
            }else{
                return thunkAPI.rejectWithValue({
                    message:"token not provided"
                })
            }
            return thunkAPI.fulfillWithValue(response.data.token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
export const registerUser = createAsyncThunk(
    "user/register",
    async(user,thunkAPI)=>{
        try{
        const request = await clientServer.post('/register',{
            username:user.username,
            password:user.password,
            email:user.email,
            name:user.name
        });
        return thunkAPI.fulfillWithValue(request.data); 
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message);

        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
        try{
        const response = await clientServer.get("/get_user_and_profile",{
            params:{
            token : user.token
        }
    })
    return thunkAPI.fulfillWithValue(response.data)
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)
export const getAllUser = createAsyncThunk(
    "user/getAllUser",
    async(_,thunkAPI)=>{
        try{
        const response = await clientServer.get("/users/get_all_users")
        return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token: user.token,
                connectionId:user.user_id
            })
            thunkAPI.dispatch(getConnectionRequest({token : user.token}))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
export const getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequests",
    async (user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/getConnectionRequests",{
                params:{
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data.connections)
        }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
export const getMyConnectionRequests = createAsyncThunk(
    "user/getMyConnectionRequests",
    async (user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/user_connection_request",{
              token:user.token,
            //   connectionId:user.connectionId,
            //   action_type:user.action
            });
            return thunkAPI.fulfillWithValue(response.data.connections);
        }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
export const AcceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async(user,thunkAPI)=>{
    try{
      const response = await clientServer.post("/user/accept_connection_request",{
        token:user.token,
        connection_id: user.connectionId,
        action_type:user.action
      })
      return thunkAPI.fulfillWithValue(response.data)
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message);
        }
        }
)