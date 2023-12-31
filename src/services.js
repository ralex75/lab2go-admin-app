import axios from 'axios'
import storage from './composables/storage';
import router from './router'


const BASE_URL={"DEV":'/api',"PROD":'/lab2go/admin/api',"DEBUG":'/lab2go/debug/api'}

// FOR PRODUCTION
const instance=axios.create({
  baseURL:BASE_URL.DEV,
  timeout: 1000,
  withCredentials:true
});

instance.interceptors.response.use((response) => response, 

(error) => {
  
  
  if (error.response && !error.response.data.msg) {
      
      storage.unset("session")
      router.push({name:'login.index'})
      return Promise.reject(error.response.data);

  }
  
  return Promise.reject(error.response.data.msg);
   
});

export default instance