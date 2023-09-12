<template>
        
        <div class="container min-width"  v-if="school">
          
            <form @submit="doUpdateSchool()">
               
                <div class="row">
                    <div class="form-group col-md-6">
                        <label>Istituto Principale</label>
                        <input type="text" class="form-control" required v-model="form.sc_tab_istituto">
                    </div>
                    <div class="form-group col-md-3">
                        <label>Codice</label>
                        <input type="text" class="form-control" required v-model="form.sc_tab_code">
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6">
                        <label>Plesso/Scuola</label>
                        <input type="text" class="form-control" required v-model="form.sc_tab_plesso">
                    </div>
                    <div class="form-group col-md-3">
                        <label>Codice</label>
                        <input type="text" class="form-control" required v-model="form.sc_tab_plesso_code">
                    </div>
                </div>
                <div class="form-group col-md-9">
                    <label>Indirizzo</label>
                    <input type="text" class="form-control" required v-model="form.sc_tab_indirizzo">
                </div>
                <div class="form-group col-md-9">
                    <label>Telefono</label>
                    <input type="text" class="form-control" required v-model="form.sc_tab_telefono">
                </div>
                <div class="form-group col-md-9">
                    <label>Indirizzo mail</label>
                    <input type="email" class="form-control" name="email" id="email" required pattern="([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})" v-model="form.sc_tab_email">
                </div>
                <div class="form-group col-md-9">
                    <label>Tutors</label>
                    <textarea class="form-control" id="tutors" style="resize: none;" rows="3" v-model="form.tutors"></textarea>
                </div>
                <br>
                <div class="col-md-9">
                    <input type="submit"  :disabled="!dataIsChanged" class="btn w-100  btn-lg btn-primary"  value="Aggiorna"  />
                </div>
                
        </form>

    </div>
        

    
</template>

<script setup>
import { ref,computed,watchEffect,reactive } from 'vue';
import useSchool from '@/composables/school.composable'

const props=defineProps({"schoolId":{type:Number,required:true}})
const emit=defineEmits("onSchoolUpdated")
const { school, getSchool, saveSchool, errors } = useSchool();
const schoolId=ref(props.schoolId)
const form=reactive({"tutors":""})

watchEffect(() =>
        getSchool(schoolId.value).then(res=>{
           Object.assign(form,JSON.parse(school.value.school_json_data))
           form.tutors=school.value.tutors
        })
    );
       
    const dataIsChanged = computed(()=>{
        return school.value.school_json_data!=JSON.stringify(form)
    });
    
    const doUpdateSchool=()=>{
        saveSchool(schoolId.value,form).then(_=>{
            emit('onSchoolUpdated')
        })
    }

const pattern={
    alpha:"[a-zA-Z\\s]+",
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
    
</script>
<style scoped>
.min-width{
    min-width: 600px;
    min-height: 500px;
}
.form-group{
    margin: 6px 0;
}
</style>
