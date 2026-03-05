import axios from "axios"
const AUTH_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

//this is creating an axios instance
export default axios.create({ 
    baseURL: AUTH_BASE_URL + "/auth"
});
