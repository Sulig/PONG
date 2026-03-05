import axios from "axios"
const AUTH_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default axios.create({
    baseURL: AUTH_BASE_URL + "/friends",
    withCredentials: true
});
