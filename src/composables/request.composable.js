import axios from "../services"
import {ref} from 'vue'
import { useRouter } from "vue-router"

export default function useRequest(){
    
    const requests=ref([])
    const request=ref({})
    const error=ref("")
    const working=ref(true)
    const router=useRouter()
   
    const getRequests=async (filter)=>
    {   working.value=true
        try{
            let {data}=await axios.post(`/requests/list`,{filter}) 
            requests.value=data.requests.map(r=>map(r))
        }
        catch(exc){
            console.log(exc)
        }
        finally{
            working.value=false
        }
    }  

    const createRequest=async(formdata)=>{
        error.value=""
        try{
            await axios.post(`/requests/create`,formdata) 
            router.push({"name":"requests.index"})
        }
        catch(exc){
            error.value=exc
        }

    }

    
    const map=(data)=>{
        data.user_json_data=JSON.parse(data.user_json_data)
        data.school_json_data=JSON.parse(data.school_json_data)
        data.disci_accepted=JSON.parse(data.disci_accepted)
        return data
    }

    const getRequest=async (id)=>
    { 

        let {data}=await axios.get(`/requests/${id}`) 
        request.value=data.request
    }  

    //id => id della richiesta
    //disciList => lista discipline accettate
    const saveRequest=async (rid, usr_data={},disci_accepted=[], status="UNDEFINED")=>{
        error.value=""
        try{
           
            if(status.indexOf('ACCEPTED')<0){ disci_accepted=[]}
            
            let {data}=await axios.put(`/requests/${rid}/update`,{usr_data, disci_accepted, status}) 
          
            return data
        }
        catch(exc){
            error.value=exc
        }
    }
    const deleteRequest=async (rid)=>{
        error.value=""
        try{
           
            
            await axios.delete(`/requests/${rid}`) 
          
        }
        catch(exc){
            error.value=exc
        }
    }

    const commitRequests=async()=>{
        
        error.value=""
        
        try{
            
            let {data}=await axios.put(`/requests/commit`) 
            if(data.exc){ throw new Error("Si è verificato un problema nell'inserimento dati") }
        }
        catch(exc){
            
            error.value=exc.message
        }
    }

    
    return {
        request,
        requests,
        working,
        error,
        getRequests,
        getRequest,
        saveRequest,
        deleteRequest,
        commitRequests,
    }
}
