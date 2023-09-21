import axios from "../services"
import { reactive,ref,computed } from 'vue'
import { useRouter } from "vue-router"



export default function useUserAccount(){
    
    //const user=ref(null)  
    const error=ref("")  
    const router=useRouter()
    const working=ref(false)
    const accounts=ref([])
    const account=ref({})

    
    const getAccounts=async ()=>{
        try{
           
            let {data}=await axios.get("/user/list",{withCredentials:true})
            accounts.value=data
        }
        catch(exc){
           
            error.value=exc.response.data
        }
    }

    

    
    return {
      accounts,
      account,
      getAccounts
      
    }
}
