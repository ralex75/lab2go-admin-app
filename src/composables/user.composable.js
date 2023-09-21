import axios from "../services"
import { ref,computed } from 'vue'
import {useRouter}  from "vue-router"
import storage from "./storage"
import roles from "../roles"

const user=ref(null)

export default function useUser(){
    
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
        return user.value && user.value.role==roles.ADMIN
    })

    const isCoordinator=computed(()=>{
        return user.value && user.value.role==roles.COORDINATORE
    })

    const isDocente=computed(()=>{
        return user.value && user.value.role==roles.DOCENTE
    })

    const isLoggedIn=computed(()=>{
        return user.value!=null
    })

    const signUp=async (user,email)=>{
        try{
           
            await axios.post("/user/create",{user,email})
            //router.push({name:'home.index'})
        }
        catch(exc){
            let msg=(exc.type && exc.type=="duplicated") ? "Utente già registrato.": "Errore generico"
            error.value=msg
            throw exc
        }
    }

    const signIn=async ({email,password})=>{
        
            try{
                working.value=true
                let {data}=await axios.post("/user/login",{email,password})
                storage.set(STORAGE_KEY,data.user)
                user.value=data.user
                router.push({name:'home.index'})
            }
            catch(exc){
                error.value="Credenziali non valide."
                console.log(exc)
            }
            finally{
                working.value=false
            }
     
    }

    const signOut=async ()=>{
        await axios.post("/user/logout").finally(_=>{
            storage.unset(STORAGE_KEY)
            user.value=null
            router.push({name:'login.index'})
        })
       
    }

    const getUsers=async ()=>{
        try{
           
            let {data}=await axios.get("/user/list",{withCredentials:true})
            users.value=data
        }
        catch(exc){
           
            error.value=exc.response.data
        }
    }

    const deleteUser=async (email)=>{
        await axios.delete(`/user/${email}`)
    }

   

    return {
       user,
       users,
       error,
       working,
       currentUser,
       signUp,
       signIn,
       signOut,
       deleteUser,
       getUsers,
       isAdmin,
       isCoordinator,
       isDocente,
       isLoggedIn
    }
}


