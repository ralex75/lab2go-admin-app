<template>
        
        <div class="container min-width"  v-if="school">
           
            <form @submit.prevent="doUpdateSchool()" novalidate :class="{'was-validated':formValidated}">
                <h5>Istituto</h5>
                <div class="section">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label>Istituto Principale</label>
                            <input type="text" class="form-control" readonly required v-model="form.sc_tab_istituto">
                        </div>
                        <div class="form-group col-md-3">
                            <label>Codice</label>
                            <input type="text" class="form-control" readonly required v-model="form.sc_tab_code">
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label>Plesso/Scuola</label>
                            <input type="text" class="form-control" readonly required v-model="form.sc_tab_plesso">
                        </div>
                        <div class="form-group col-md-3">
                            <label>Codice</label>
                            <input type="text" class="form-control" readonly required v-model="form.sc_tab_plesso_code">
                        </div>
                    </div>
                    <div class="form-group col-md-9">
                        <label>Indirizzo</label>
                        <input type="text" class="form-control" readonly="true" required v-model="form.sc_tab_indirizzo">
                    </div>
                    <div class="form-group col-md-9">
                        <label>Telefono</label>
                        <input type="text" class="form-control" required pattern="\d+" v-model="form.sc_tab_telefono"  >
                        <div :class="{'invalid-feedback':errors.phone}">
                            {{ errors.phone }}
                        </div>
                    </div>
                    <div class="form-group col-md-9">
                        <label>Indirizzo mail</label>
                        <input type="email" class="form-control" readonly="true" name="email" id="email" required v-model="form.sc_tab_email">
                    </div>
                </div>
                <h5>Tutor</h5>
              
                <div class="section">
                    <div class="form-group col-md-9">
                        <label>Nome</label>
                        <input type="text" :readonly="!canEditTutor" class="form-control" required pattern="[a-zA-Z]+" v-model="form.tutor.name">
                        <div :class="{'invalid-feedback':errors.name}">
                            {{ errors.name }}
                        </div>
                    </div>
                    <div class="form-group col-md-9">
                        <label>Cognome</label>
                        <input type="text" :readonly="!canEditTutor" class="form-control" required pattern="[a-zA-Z]+" v-model="form.tutor.surname">
                        <div :class="{'invalid-feedback':errors.surname}">
                            {{ errors.surname }}
                        </div>
                    </div>
                    <div class="form-group col-md-9">
                        <label>Indirizzo mail</label>
                        <input type="email" :readonly="!canEditTutor" class="form-control" required v-model="form.tutor.email"  >
                        <div :class="{'invalid-feedback':errors.email}">
                            {{ errors.email }}
                        </div>
                    </div>
                </div>
               
                <div class="col-md-9">
                    <input type="submit" :disabled="!dataIsChanged" class="btn w-100  btn-lg btn-primary"  value="Aggiorna"  />
                </div>
                
        </form>

    </div>
        

    
</template>

<script setup>
import { ref,computed,watchEffect,reactive } from 'vue';
import useSchool from '@/composables/school.composable'
import useUser from '@/composables/user.composable'

const props=defineProps({"schoolId":{type:Number,required:true}})
const emit=defineEmits("schoolUpdated")
const { school, getSchool, saveSchool, errors } = useSchool();
const {isDocente}=useUser()
const schoolId=ref(props.schoolId)
const form=reactive({"tutor":{"name":"","surname":"","email":""}})


watchEffect(() =>
        getSchool(schoolId.value).then(res=>{
           Object.assign(form,JSON.parse(school.value.school_json_data))
           let tutor=school.value.tutor
           if(tutor){
             Object.assign(form.tutor,JSON.parse(tutor))
           }
        })
    );
       
    const dataIsChanged = computed(()=>{
        return school.value.school_json_data!=JSON.stringify(form)
    });
    
    const doUpdateSchool=()=>{
        
        if(!formIsValid()) return
       
        saveSchool(schoolId.value,form).then(_=>{
            emit('schoolUpdated')
        })
    }

const pattern={
    alpha:"[a-zA-Z\\s]+$",
    email:"[\\w-\.]+@([\\w-]+\.)+[\\w-]{2,4}$",
    digit:"\\d+"
}

const canEditTutor=computed(()=>{
    return !isDocente.value
    
})

const formValidated=ref(false)

const formIsValid= ()=>{

    errors.value={}
    
    let tutor = form.tutor
    if(!tutor.name || !(new RegExp(pattern.alpha).test(tutor.name))) {errors.value["name"]="Il campo nome non è valido"}
    if(!tutor.surname || !(new RegExp(pattern.alpha).test(tutor.surname))) {errors.value["surname"]="Il campo cognome non è valido"}
    if(!tutor.email || !(new RegExp(pattern.email).test(tutor.email))) {errors.value["email"]="Il campo email non è valido"}
    if(!form.sc_tab_telefono || !(new RegExp(pattern.digit).test(form.sc_tab_telefono))) {errors.value["phone"]="Il campo telefono non è valido"}

    formValidated.value=true

    return Object.keys(errors.value).length==0
}
    
</script>
<style scoped>
.min-width{
    min-width: 600px;
    min-height: 500px;
}
.form-group{
    margin: 6px 0;
}
.section{
    border-top: 1px solid #DDD;
    margin-bottom: 20px;
}

</style>
