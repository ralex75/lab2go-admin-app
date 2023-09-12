import axios from "../services"
import {ref} from 'vue'
import { useRouter } from "vue-router"

export default function useSchool(){
    
    const schools=ref([])
    const school=ref({})
    const router=useRouter()
    const errors=ref([])
    const working=ref(false)
    const schoolYears=ref([])

    
    const getSchools=async ({keyword,year}={"keyword":"","year":""})=>
    {   
        keyword=keyword || ''
        
        let {data}=await axios.post(`/schools`,{keyword,year}) 
      
        schools.value=data.schools
                                 .map(s=>({ 
                                        
                                        id:s.id,
                                        year:s.year,
                                        data:JSON.parse(s.school_json_data),
                                        discipline:JSON.parse(s.discipline),
                                        students:s.students
                                    }))
    }  
    
    const getSchoolPartecipationYears=async(schoolId)=>{
        let {data}=await axios.get(`/schools/${schoolId}/years`)  
        schoolYears.value=data.years
    }


    //code => codice meccanografico
    const getSchoolInfo=async(code)=>{
        
        schools.value=[]
        working.value=true
        let {data}=await axios.get(`/schools/mcode/${code}`)
        const doc = new DOMParser().parseFromString(data, 'text/html');
        const table = doc.querySelector('.sc-table > tbody ');
        let rows=Array.from(table.rows)
        
        rows.forEach(r=>{
            let cells=Array.from(r.cells)
            let school={}
    
            cells.forEach(c=>{
                
                let k=c.classList[0].replaceAll("-","_")
                
                //pulisce la stringa da eventuali spazi vuoti multipli
                school[k]=c.children[0].outerText.split(" ").filter(i=>i).join(" ")
                if(k=='sc_tab_plesso')
                {
                    school[k+"_code"]=c.children[1].outerText.trim()
                }
            })

            schools.value.push(school)
        })
        
        working.value=false
    }

    
    const getSchool=async (id)=>
    { 
      
        let {data}=await axios.get(`/schools/${id}`) 
        school.value=data.school
    }  

    const storeSchool=async (data)=>
    { 
        errors.value=''
        try{
            
            await axios.post("/schools",data) 
            await router.push({name:'schools.index'})
        }
        catch(exc){
            handlingError(exc)
        }
    }   

    const saveSchool=async (id,school)=>
    { 
        errors.value=''
        try{
            
            await axios.put(`/schools/${id}`,{"school":school}) 
            
        }
        catch(exc){
            handlingError(exc)
        }
    }   

    const handlingError=(exc)=>{
        console.log("exc:",exc)
        const {errors:res_errors}=exc?.response?.data
        errors.value=res_errors.map(e=>`${e['msg']}`)
    }

    const deleteSchool=async (id)=>{
        await axios.delete(`/schools/${id}`)
    }

    return {
        schools,
        school,
        errors,
        working,
        schoolYears,
        getSchoolInfo,
        getSchools,
        getSchool,
        getSchoolPartecipationYears,
        storeSchool,
        saveSchool,
        deleteSchool
    }
}
