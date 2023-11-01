import axios from "../services"
import { reactive,ref } from 'vue'
import { useRouter } from "vue-router"

export default function useStudent(){
    
    const students=ref([])
    const student=reactive({})
    const errors=ref([])
    const error=ref("")

    const getStudents=async (schoolId)=>
    { 
        
        let {data}=await axios.get(`/schools/${schoolId}/students`) 
        students.value=data.students
    }  
    
    const getStudent=async (id)=>
    { 
       
        let response=await axios.get(`/student/${id}`) 
        student.value=response.data.student
        
    }  

    const storeStudent=async (schoolId,student)=>
    { 
        error.value=""

        try{
            await axios.post("/students/store",{schoolId,student}) 
            //router.push({name:'school.details',params:{id:schoolId}})
        }
        catch(exc){
            error.value=exc
        }
    }   

    const uploadStudentsList=async({disciplina,file},schoolId)=>{
        
        error.value=""
        
        try{
            
            let formData=new FormData()
            formData.append("disciplina",disciplina)
            formData.append("file",file)
            formData.append("schoolId",schoolId)
           
            await axios.post("/students/upload",formData,{ headers:{"Content-Type": "multipart/form-data"}}) 
            
        }
        catch(exc){
            error.value=exc
            throw exc;
        }
    }




    const destroyStudent=async (id)=>{
        await axios.delete(`/students/${id}`)
        
    }

    return {
        error,
        errors,
        student,
        students,
        getStudent,
        getStudents,
        storeStudent,
        destroyStudent,
        uploadStudentsList,
        
    }
}
