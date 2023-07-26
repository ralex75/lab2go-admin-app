import axios from "../services"
import { reactive,ref } from 'vue'
import { useRouter } from "vue-router"

export default function studentHelper(){
    
    const students=ref([])
    const student=reactive({})
    const router=useRouter()
    const errors=ref([])

    const getStudents=async (schoolId,year=new Date().getUTCFullYear())=>
    { 
        let response=await axios.get(`/students/${schoolId}/${year}`) 
        students.value=response.data.students
    }  
    
    const getStudent=async (id)=>
    { 
       
        let response=await axios.get(`/student/${id}`) 
        student.value=response.data.student
        
    }  

    const storeStudent=async (schoolId,student)=>
    { 
        errors.value=[]

        try{
            await axios.post("/students",{schoolId,student}) 
            router.push({name:'school.details',params:{id:schoolId}})
        }
        catch(exc){
            console.log(exc)
            handlingError(exc)
        }
    }   

    const uploadStudentsList=async(file,schoolId=5)=>{
        try{
            let formData=new FormData()
            
            formData.append("file",file)
            formData.append("schoolId",schoolId)
            await axios.post("/students/upload",formData,{ headers:{"Content-Type": "multipart/form-data"}}) 
            
        }
        catch(exc){
            console.log(exc)
            handlingError(exc)
        }
    }

    /*const saveSchool=async (id)=>
    { 
        errors.value=''
        try{
            
            await axios.put(`/schools/${id}`,school.value) 
            await router.push({name:'school'})
        }
        catch(exc){
            handlingError(exc)
        }
    }   */

    const handlingError=(exc)=>{
       
       
        const res_errors=exc?.response?.data
        //console.log("ERR:",res_errors)
        errors.value=Array.isArray(res_errors) ? res_errors.map(e=>`${e['msg']}`) : [res_errors.msg || res_errors]
        
    }

    const destroyStudent=async (id)=>{
        await axios.delete(`/students/${id}`)
        
    }

    return {
        errors,
        student,
        students,
        getStudent,
        getStudents,
        storeStudent,
        destroyStudent,
        uploadStudentsList
    }
}
