<template>
<div class="container" style="width:600px">
    <h3 class="text-center">Nuovo studente</h3>
    <form  @submit.prevent="doSave()" novalidate :class="{'was-validated':formValidated}">
            <div class="form-group row mt-1" >
                <label for="name" class="col-sm-2 col-form-label">*Nome</label>
                <div class="col-sm-10">
                    <input type="text" name="name" class="form-control"  v-model="form.name" :pattern="pattern.alpha" required id="name" placeholder="Nome studente">
                    <div :class="{'invalid-feedback':errors.name}">
                        {{ errors.name }}
                    </div>
                </div>
            </div>
            <div class="form-group row mt-1" >
                <label for="surname" class="col-sm-2 col-form-label">*Cognome</label>
                <div class="col-sm-10">
                    <input type="text" name="surname" class="form-control" id="surname" :pattern="pattern.alpha" v-model="form.surname" required placeholder="Cognome studente">
                    <div :class="{'invalid-feedback':errors.surname}">
                        {{ errors.surname }}
                    </div>
                </div>
            </div>
            <div class="form-group row mt-1" >
                <label for="email" class="col-sm-2 col-form-label">*Email</label>
                <div class="col-sm-10">
                    <input type="text" name="email" class="form-control" id="email" required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"  v-model="form.email" placeholder="Email studente">
                    <div :class="{'invalid-feedback':errors.email}">
                        {{ errors.email }}
                    </div>
                </div>
            </div>
            
        
            <div class="form-group row mt-1" >
                <label for="disciplina" class="col-sm-2 col-form-label">Disciplina</label>
                <div class="col-sm-10">
                    
                    <DisciplinaList ref="disciList" v-if="school.discipline" :discipline="school.discipline"></DisciplinaList>
                    
                    <div v-if="!selectedDisciplina" :class="{'invalid-feedback':!selectedDisciplina}">
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

import { computed, reactive,ref } from 'vue';
import useStudent from '@/composables/student.composable';
import DisciplinaList from '../DisciplinaList.vue';

const {storeStudent,error}=useStudent()

const props=defineProps({
    "school":{type:Object,required:true}
})

const emits=defineEmits(["storedStudent"])
const disciList=ref(null)

const form=reactive({
    name:"",
    surname:"",
    email:"",
    disciplina:""
})

const errors=reactive({
    name:"",
    surname:"",
    email:""
})

const pattern={
    alpha:"[a-zA-Z\\s]+",
    email:"[\\w\-\.]+@([\\w-]+\.)+[\\w-]{2,4}"
}

const formValidated=ref(false)

const selectedDisciplina=computed(()=>{
    return disciList.value?.selectedDisciplina
})

const formIsValid=async ()=>{

    formValidated.value=false
    errors.name=errors.surname=errors.email=""

    if(!form.name){
        errors.name="Il nome è richiesto"
    }
    if(!form.surname){
        errors.surname="Il cognome è richiesto"
    }

    
    if(!form.email || !new RegExp(pattern.email).test(form.email)){
        errors.email="Il campo email non è valido"
    }
    

    formValidated.value=true

    
    return !errors.name && !errors.surname && !errors.email && selectedDisciplina
}

const doSave=async ()=>{
    if(!await formIsValid())
    {
        console.log("Form is Invalid")
        return
    }

    
    form.disciplina=selectedDisciplina.value
   
    storeStudent(props.school.id,form).then(_=>{
        emits("storedStudent")
        Object.keys(form).forEach(k=>form[k]="")
        formValidated.value=false
    })
   
}

  

</script>

