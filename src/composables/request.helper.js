import axios from "../services"
import {ref} from 'vue'
import { useRouter } from "vue-router"

export default function requestHelper(){
    
    const requests=ref([])
    const request=ref({})
    const errors=ref([])
    const error=ref("")
    const router=useRouter()
   
    const getRequests=async (filter)=>
    {   
        let {data}=await axios.post(`/requests/list`,{filter}) 
        requests.value=data.requests.map(r=>map(r))
        
    }  

    const createRequest=async(formdata)=>{
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

        try{
           
            if(status=='REJECTED' || status=='SUBMITTED'){ disci_accepted=[]}
            
            let {data}=await axios.put(`/requests/${rid}/update`,{usr_data, disci_accepted, status}) 
          
            return data
        }
        catch(exc){
            errors.value.push(exc)
        }
    }

    const finalize=async()=>{
        
        errors.value=""
        
        try{
            await axios.put(`/requests/finalize`) 
        }
        catch(exc){
            errors.value.push(exc)
        }
    }

    
    return {
        request,
        requests,
        getRequests,
        getRequest,
        saveRequest,
        finalize
    }
}
