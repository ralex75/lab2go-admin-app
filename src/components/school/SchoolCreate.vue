<template>
        
        <div class="block-container">
            <DisplayErrors :errors="errors"/>

            <div class="form-group gap" >
             
                <form @submit.prevent="doSave()">
                    <div>
                        <div class="form-group">
                            <label for="schoolName" class="col-sm-2 control-label">Nome</label>
                            <div class="col-sm-10">
                                <input type="text" name="name" class="form-control" v-model="school.name" id="schoolName" placeholder="Nome scuola">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="schoolAddress" class="col-sm-2 control-label">Indirizzo</label>
                            <div class="col-sm-10">
                                <input type="text" name="address" class="form-control" id="schoolAddress" v-model="school.address" placeholder="Indirizzo scuola">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="schoolAddress" class="col-sm-2 control-label">Sezione</label>
                            <div class="col-sm-10">
                               <select v-model="school.section" >
                                <option v-for="section in sections" :key="section" :value="section">
                                    {{ section }}
                                </option>
                               </select>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group inline gap">
                        <button type="submit" class="btn btn-primary">Aggiungi</button>
                    </div>
                </form>
            </div>
        </div>
</template>

<script>
import { reactive } from 'vue';
import schoolHelper from '../../composables/school.helper'
import DisplayErrors from '../DisplayErrors.vue';
import {sections} from '../../sections'


export default {
    name:'CreateSchool',
   
    setup(){

        
        const school=reactive({
            'name':'',
            'address':'',
            'section':''
        })

        
       
        const {storeSchool,errors} = schoolHelper()

        const doSave=async ()=>{
            await storeSchool({...school})
        }

        return{
            school,
            errors,
            sections,
            doSave
        }
    },
    components: { DisplayErrors }
}
</script>

