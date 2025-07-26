import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "http://127.0.0.1:8080", 
  withCredentials: true,
  timeout: 10000,
});

AxiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage, Redux store, or context
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Ensure headers object exists and preserve existing headers
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Final headers being sent:', JSON.stringify(config.headers, null, 2));
    console.log('Request URL:', config.url);
    console.log('Request method:', config.method);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosClient;