<template>
        
        <div class="container min-width"  v-if="school">
           
            <form @submit.prevent="doUpdateSchool()">
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
                       
                    </div>
                    <div class="form-group col-md-9">
                        <label>Indirizzo mail</label>
                        <input type="email" class="form-control" readonly="true" name="email" id="email" required v-model="form.sc_tab_email">
                    </div>
                </div>
                <div class="form-group col-md-9">
                    <label>Disciplina</label>
                    <select v-if="form.discipline" class="form-control" v-model="selectedDisciplina" @change="form.tutor[selectedDisciplina]=(form.tutor[selectedDisciplina] || form.discipline[selectedDisciplina])" >
                        <option :value="k" v-for="k in Object.keys(form.discipline)">{{k}}</option>
                    </select>
                </div>
                <div class="form-group col-md-9">
                    
                    <label>Tutor</label>
                    <select v-if="tutors" class="form-control" v-model="form.tutor[selectedDisciplina]">
                        <option :value="t.id" v-for="t in tutors">{{t.name}}</option>
                    </select>
                </div>
                <div class="col-md-9">
                    <input type="submit" class="btn w-100  btn-lg btn-primary"  value="Aggiorna"  />
                </div>
                
        </form>

    </div>
        

    
</template>

<script setup>
import { ref,watchEffect,reactive } from 'vue';
import useSchool from '@/composables/school.composable'
import useTutor from '@/composables/tutor.composable'


const props=defineProps({"schoolId":{type:Number,required:true}})
const emit=defineEmits(["schoolUpdated"])

const { school, getSchool, saveSchool, errors } = useSchool();
const {getTutors,tutors} = useTutor()

const schoolId=ref(props.schoolId)
const form=reactive({})
const selectedDisciplina=ref(null)


watchEffect(() =>
        getSchool(schoolId.value).then(res=>{
           getTutors()
           Object.assign(form,JSON.parse(school.value.school_json_data))
           form.discipline=JSON.parse(school.value.discipline)
           let keys=Object.keys(form.discipline)
           selectedDisciplina.value=keys[0]
           form.tutor={...form.tutor,...form.discipline}
         
        })
     
    );
       

    
    const doUpdateSchool=()=>{
        
        saveSchool(schoolId.value,form).then(_=>{
            emit('schoolUpdated')
        })
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
