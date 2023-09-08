<template>
<div class="container" style="width:600px">
    <h3 class="text-center">Esporta studenti</h3>
    <form  @submit.prevent="doSave()" novalidate :class="{'was-validated':formValidated}">
            
            
        
            <div class="form-group row mt-1" >
                <label for="disciplina" class="col-sm-2 col-form-label">Disciplina</label>
                <div class="col-sm-10">
                    <select class="form-select" required aria-label="Default select example" v-model="form.disciplina">
                        <option selected value="" v-if="discipline?.length>0 && !form.disciplina">Seleziona disciplina</option>
                        <option v-for="d in discipline" :value="d">{{ d }}</option>
                    </select>
                    <div v-if="!form.disciplina" :class="{'invalid-feedback':!form.disciplina}">
                        Disciplina non selezionata
                    </div>
                </div>
            </div>
        
        <div class="form-group row mt-4">
            <label class="col-sm-2"></label>
            <div class="col-sm-10 form-group  mx-auto">
                <button type="submit" class="btn btn-primary w-100">Aggiungi</button>
            </div>
        </div>
    </form>
</div>
</template>
<script setup>
import { reactive,onMounted,computed,ref } from 'vue';
import useStudent from '@/composables/student.composable';

const {storeStudent,error}=useStudent()

const props=defineProps({
    "school":{type:Object,required:true}
})

const emits=defineEmits(["storedStudent"])

const discipline=computed(()=>{
    let discipline=props.school.discipline ? JSON.parse(props.school.discipline) : []
    if(discipline?.length==1)
    {
        //form.disciplina=discipline[0]
    }
    return discipline
})

</script>