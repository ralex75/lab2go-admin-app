<template>
   <div>
         
            <StudentIndex :school-id="id"></StudentIndex>
        
   </div>                   
</template>

<script>
import { onMounted } from 'vue';
import schoolHelper from '../../composables/school.helper'
import StudentIndex from '../students/StudentIndex.vue';
import pageInfoHelper from '@/composables/pageinfo.helper';

export default {
    props: {
        id: {
            required: true,
            type: String
        }
    },
    setup(props){

      
        const { school, getSchool} = schoolHelper()
        const {setInfo}=pageInfoHelper()
             
        onMounted(async ()=>{
            await getSchool(props.id)
            let {name,address}=school.value
            setInfo({'title':name,'subtitle':address})
        })
        
        setInfo(school.address,"","")
     
        return{
            school,
            details:"blablablabla",
        }
        
    },

    components:{ StudentIndex }
    
}
</script>

<style scoped>
    div.create-container{
        
        padding-top:20px;
        
    }

    div.but-container{
        width: 120px;
    }
</style>