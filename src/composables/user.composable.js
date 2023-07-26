import axios from "../services"
import { ref,computed } from 'vue'
import {useRouter}  from "vue-router"
import storage from "./storage"


export const user=ref(null)

export default function useUser(){
    
    //const user=ref(null)  
    const error=ref("")  
    const router=useRouter()
    const STORAGE_KEY="session"
    const working=ref(false)
    const users=ref([])
    
    const currentUser=()=>{
        let cu=storage.get(STORAGE_KEY)
        user.value=cu || null
    }

    const isAdmin=computed(()=>{
        return user.value && user.value.role=='ADMIN'
    })

    const isLoggedIn=computed(()=>{
        return user.value!=null
    })

    const registerUser=async ({name,surname,email,password})=>{
        try{
           
            await axios.post("/user/create",{name,surname,email,password})
            router.push({name:'home.index'})
        }
        catch(exc){
            let msg=(exc.type && exc.type=="duplicated") ? "Utente già registrato.": "Errore generico"
          
            error.value=msg
        }
    }

    const loginUser=async ({email,password})=>{
        try{
            try{
                working.value=true
                let {data}=await axios.post("/user/login",{email,password})
                storage.set(STORAGE_KEY,data.user)
                user.value=data.user
                router.push({name:'home.index'})
            }
            catch(exc){
                error.value="Credenziali non valide."
            }
            finally{
                working.value=false
            }

        }
        catch(exc){
            console.log(exc)
            error.value=exc.response.data
        }
    }

    const logoutUser=async ()=>{
        await axios.post("/user/logout").finally(_=>{
            storage.unset(STORAGE_KEY)
            user.value=null
        })
       
    }

   

    return {
       user,
       users,
       error,
       working,
       currentUser,
       registerUser,
       loginUser,
       logoutUser,
       isAdmin,
       isLoggedIn
      
      
    }
}
