
import axios from "axios"

export const base_URL = 'http://localhost:9000';

 export const clientServer = axios.create({
    baseURL : base_URL,
})