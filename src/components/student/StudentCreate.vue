<template>
<div class="container" style="width:600px" >
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
                <label for="email" class="col-sm-2 control-label">*Email</label>
                <div class="col-sm-10">
                    <input type="text" name="email" class="form-control" id="email" required :pattern="pattern.email" v-model="form.email" placeholder="Email studente">
                    <div :class="{'invalid-feedback':errors.email}">
                        {{ errors.email }}
                    </div>
                </div>
            </div>
            
        
            <div class="form-group row mt-1" >
                <label for="disciplina" class="col-sm-2 control-label">Disciplina</label>
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
import useSchool from '../../composables/school.composable';

const {storeStudent,error}=useStudent()
const {getSchool,school}=useSchool()


const props= defineProps({
    schoolId:{
        type: String,
        required:true
    }
})

const emits=defineEmits(["storedStudent"])

onMounted(()=>{getSchool(props.schoolId)})

const discipline=computed(()=>{
    let discipline=school.value.discipline ? JSON.parse(school.value.discipline) : []
    if(discipline?.length==1)
    {
        //form.disciplina=discipline[0]
    }
    return discipline
})

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
    alpha:"[a-zA-Z]+",
    email:"[\\w-\.]+@([\\w-]+\.)+[\\w-]{2,4}"
}

const formValidated=ref(false)

const formIsValid=async ()=>{

    const required=(value)=>{
        return value!="" 
    }
    
    
    const validations={"name":[required,new RegExp(pattern.alpha)],
                        "surname": [required,new RegExp(pattern.alpha)],
                        "email":[required,new RegExp(pattern.email)]
    }


    Object.keys(errors).forEach(k=>{
        validations[k].forEach(fn=>{
            errors[k]=""
            
            let res=(fn['test'] ? fn.test(form[k]) : fn(form[k]))
            if(!res){
                errors[k]="Valore non valido"
            }
        })
    })

    formValidated.value=true

    return !errors.name && !errors.surname && !errors.email && form.disciplina
}

const doSave=async ()=>{
    if(!await formIsValid())
    {
        return
    }

    storeStudent(props.schoolId,form).then(_=>{
        emits("storedStudent")
        Object.keys(form).forEach(k=>form[k]="")
        formValidated.value=false
    })
   
}

  

</script>

