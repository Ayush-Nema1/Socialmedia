import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
     async(_, thunkAPI) =>{
        try{
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
     }
)
export const createpost = createAsyncThunk(
    "post/createPost",
    async(userdata,thunkAPI)=>{
        const {file,body} = userdata;
        try {
            const formData = new FormData();
            formData.append('token',localStorage.getItem('token'));
            formData.append('body',body)
            formData.append('media',file)
            
            const response = await clientServer.post("/posts",formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            if(response.status === 200){
                return thunkAPI.fulfillWithValue("post Uploaded")
            }

        } catch (error) {
                        return thunkAPI.rejectWithValue(error.response.data)

        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id,thunkAPI)=>{
        try{
            const response = await clientServer.delete("/delete_post",{
                data :{
                    token : localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            });
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)

        }
    }
)