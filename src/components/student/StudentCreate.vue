<template>
            <div class="block-container">
                <div>
                    <form  @submit.prevent="doSave()">
                        <div class="form-group inline gap" >
                            <div class="form-group" >
                                <label for="studentName" class="col-sm-2 control-label">Nome</label>
                                <div class="col-sm-10">
                                    <input type="text" name="name" class="form-control" v-model="form.name" id="studentName" placeholder="Nome studente">
                                </div>
                            </div>
                            <div class="form-group" >
                                <label for="studentSurname" class="col-sm-2 control-label">Cognome</label>
                                <div class="col-sm-10">
                                    <input type="text" name="address" class="form-control" id="studentSurname" v-model="form.surname" placeholder="Cognome studente">
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group inline gap">
                            <button type="submit" class="btn btn-primary">Aggiungi</button>
                            <router-link :to="{name:'school.details',params:{id:id}}" class="link-as-button">Annulla</router-link>
                        </div>
                    </form>
                </div>
            </div>
      
</template>

<script>

import { reactive } from 'vue';
import studentHelper from '@/composables/student.helper';
import DisplayErrors from '../DisplayErrors.vue';

export default {
    props:{
        id:{
            type: String,
            required:true
        }
        
    },
    setup(props){

        const {storeStudent,errors}=studentHelper()
        
        const form=reactive({
            name:"",
            surname:""
        })

        const doSave=async ()=>{
            await storeStudent(props.id,form)
        }

        return{
            form,
            doSave,
            errors
        }

    },
    components:{DisplayErrors}
   
}

</script>

