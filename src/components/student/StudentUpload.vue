<template>
        <div class="container-md" style="width:600px">
            <h3 class="text-center">Carica lista studenti</h3>
            <div class="form-group mb-2" >
                <label for="disciplina" class="form-label mb-0">Disciplina</label>
                
                    <select class="form-select" required aria-label="Default select example" v-model="form.disciplina">
                        <option selected value="" v-if="discipline?.length>0 && !form.disciplina">Seleziona disciplina</option>
                        <option v-for="d in discipline" :value="d">{{ d }}</option>
                    </select>
                 
            </div>
            <div class="form-group mb-4">
                <label for="disciplina" class="form-label mb-0">Lista</label>
                <input type="file" class="form-control" @change="handleFileUpload"  accept=".txt" id="inputGroupFile02" >
            </div>
            
            <div class="row">
                <div class="col text-center">
                    <button type="button" :disabled="isDisabled" class="btn w-100" @click="doUpload" :class="{'btn-primary':!isDisabled}">Carica</button>
                </div> 
            </div>    
        </div>
</template>

<script setup>
import { reactive,computed } from 'vue';
import useStudent from '@/composables/student.composable'


const form=reactive({file:"",disciplina:""})

const props=defineProps({
    "school":{type:Object,required:true}
})

const emit=defineEmits(['uploadedStudents'])

const{uploadStudentsList,error} = useStudent()

const isDisabled=computed(()=>{
    
    return !form.file || !form.disciplina
})

const handleFileUpload=async(event)=>{
    const {files}=event?.target
    if(!files)return
    form.file=files[0]
    
}

const discipline=computed(()=>{
    return JSON.parse(props.school.discipline)
})

const doUpload = async () => {

            try {
                working.value = true;
                await uploadStudentsList(form, school.value.id);
                emit('uploadedStudents')    
            }
            catch (exc) {  }
            finally {
                working.value=false    
            }
        };


  
</script>