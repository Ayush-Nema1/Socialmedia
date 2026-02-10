
import axios from "axios"

export const base_URL = 'https://socialmedia-84fy.onrender.com';

 export const clientServer = axios.create({
    baseURL : base_URL,
})