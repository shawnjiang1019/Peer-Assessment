import axios from "axios";
import { env } from "process";


const AxiosClient = axios.create({
  baseURL: "http://127.0.0.1:8080", // Your API base URL
  timeout: 10000, // Optional: set timeout
});


AxiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage, Redux store, or context
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosClient;