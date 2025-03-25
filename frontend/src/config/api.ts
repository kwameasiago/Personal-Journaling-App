import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost',
});


axiosInstance.interceptors.request.use(
  (config) => {
    if(!config.url){
      throw new Error('Config url is undefeined')
    }
    
    if (!config.url.includes('/login') && !config.url.includes('/register')) {
      
      const token = localStorage.getItem('token');
      if (token) {
        
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
