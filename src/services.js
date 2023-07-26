import axios from 'axios'
import storage from './composables/storage';

 
const baseURL={"PROD":'/api',
                "DEV":'http://localhost:5000/api'}


// FOR PRODUCTION
const instance=axios.create({
  baseURL:baseURL.DEV,
  timeout: 1000,
  withCredentials:true
});

instance.interceptors.response.use((response) => {
 
  
  if(response.status === 401 || response.status === 403) {
       
       alert("You are not authorized");
  }
  return response;

}, (error) => {
  
  
  if (error.response && error.response.data) {
      
      console.log("data error")
      storage.unset("session")
      return Promise.reject(error.response.data);
  }
  console.log("message error")
  return Promise.reject(error.message);
   
});

export default instance