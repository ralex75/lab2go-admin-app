<template>
        
        <div class="block-container">
            <DisplayErrors :errors="errors"/>
            <div>
                
                <form  @submit.prevent="doUpdate()">
                    <div class="form-group gap" >
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
                        <button type="submit" :disabled="!dataIsChanged" :class="{'btn-primary':dataIsChanged}" class="btn">Aggiorna</button>
                    </div>
                </form>
            </div>
        </div>
    
</template>

<script>
import { ref,onMounted,computed } from 'vue';
import schoolHelper from '../../composables/school.helper'
import DisplayErrors from '../DisplayErrors.vue';
import {sections} from '../../sections'


export default {
    name: "EditSchool",
    props: {
        id: {
            required: false,
            type: String
        }
    },
    setup(props,{emit}) {
        const { school, getSchool, saveSchool, errors } = schoolHelper();
       
        let orig = ref({});
        let currentPartecipation=computed({
            get:function(){
                return school.value.year==new Date().getUTCFullYear()
            },
            set:function(value){
                let year = value ? new Date().getUTCFullYear() : null
                school.value.year=year
            }
        })
        const doUpdate = async () => {
            await saveSchool(props.id);
        };
        const dataIsChanged = computed({
            get:()=>{
                let s = school.value;
                let o = orig.value;
                for (let k in o) {
                    if (s[k] != o[k]) {
                        return true;
                    }
                }
                return false;
            }
        });
        onMounted(async () => {
            await getSchool(props.id);
            orig.value = { ...school.value };
        });
        return {
            school,
            errors,
            currentPartecipation,
            doUpdate,
            sections,
            dataIsChanged
        };
    },
    components: { DisplayErrors }
}
</script>

