import axios from "../services"
import { reactive,ref,computed } from 'vue'


export default function useUserAccount(){
    
    const tutors=ref(null)
    const error=ref("")  
  
    
    const getTutors=async ()=>{
        try{
           
            let {data}=await axios.get("/tutors")
            tutors.value=data
        }
        catch(exc){
           
            error.value=exc.response.data
        }
    }

    const saveTutor=async (tutor)=>{
        try{
           
            

            if(!tutor.id)
            {
                await axios.post("/tutors",{tutor})
            }
            else{
                await axios.put(`/tutors/${tutor.id}`,{tutor})
            }
            
        }
        catch(exc){
           
            error.value=exc.response.data
        }
    }

    const deleteTutor=async (tutorId)=>{
        try{
           
            await axios.delete(`/tutors/${tutorId}`)
            
            
        }
        catch(exc){
           
            error.value=exc.response.data
        }
    }

    
    return {
        tutors,
        error,
        getTutors,
        saveTutor,
        deleteTutor
      
    }
}
