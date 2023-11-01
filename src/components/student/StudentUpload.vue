<template>
        <div class="container-md" style="width:600px">
            <h3 class="text-center">Carica lista studenti</h3>

            <div class="row d-flex justify-content-center" v-if="error">
                <div class="col-md-6 alert alert-danger text-center" role="alert" > 
                    {{ error }}
                </div>
            </div>

            <div class="form-group mb-2" >
                <label for="disciplina" class="form-label mb-0">Disciplina</label>
                
                <DisciplinaList ref="disciList" v-if="school.discipline" :discipline="school.discipline"></DisciplinaList>
                   
                 
            </div>
            <div class="form-group mb-4">
                <label for="disciplina" class="form-label mb-0">Lista</label>
                <input type="file" ref="upload" class="form-control" @change="handleFileUpload" lang="it" accept=".txt" id="inputGroupFile02" >
            </div>
            
           
            <div class="row">
                <div class="col text-center">
                    <button type="button" :disabled="isDisabled" class="btn w-100" @click="doUpload" :class="{'btn-primary':!isDisabled}">Carica</button>
                </div> 
            </div>    
        </div>
</template>

<script setup>
import { reactive,computed,ref,onMounted } from 'vue';
import useStudent from '@/composables/student.composable'
import DisciplinaList from '../DisciplinaList.vue';

const upload=ref(null)

const form=reactive({file:"",disciplina:""})

const props=defineProps({
    "school":{type:Object,required:true}
})

const emit=defineEmits(['storedStudent'])

const{uploadStudentsList,error} = useStudent()

const isDisabled=computed(()=>{
    
    return !form.file || !selectedDisciplina.value
})

const handleFileUpload=async(event)=>{
    const {files}=event?.target
    if(!files)return
    form.file=files[0]
    
}

onMounted(() => {
    
    let i=upload.value
})

const disciList=ref(null)

const selectedDisciplina=computed(()=>{
    return disciList.value?.selectedDisciplina
})



const doUpload = async () => {

            try {
                //working.value = true;
                
                form.disciplina=selectedDisciplina.value
               
                await uploadStudentsList(form, props.school.id);
                emit('storedStudent')    
            }
            catch (exc) {  

                console.log(exc)
            }
            finally {
                //working.value=false    
            }
        };


  
</script>