<template>
    <div class="block-container">
            
            <!--<ul>
                <li v-for="sy in schoolYears" :key="sy.id" style="margin-bottom: 6px;">
                    <router-link class="btn" :class="{'btn-success':route.params.schoolId==sy.id }" :to="{ name: 'student.index', params: { 'schoolId': sy.id }}">Studenti per anno: {{ sy.year }}</router-link>
                    <input type="button" style="margin-left: 10px;"  v-if="sy.year==2023" class="btn btn-outline-primary" value="Aggiungi studente" @click.prevent="showPopup=true;showFileBrowser=false"/>
                    <input type="button" style="margin-left: 10px;" v-if="sy.year==2023" class="btn btn-outline-primary" value="Aggiungi studenti da file" @click.prevent="showPopup=true;showFileBrowser=true"/>
                </li>
            </ul>-->
            
            <input type="button" style="margin-left: 10px;" class="btn btn-outline-primary" value="Aggiungi studente" @click.prevent="showPopup=true;showFileBrowser=false"/>
            <input type="button" style="margin-left: 10px;" class="btn btn-outline-primary" value="Aggiungi studenti da file" @click.prevent="showPopup=true;showFileBrowser=true"/>
            
          
            <div class="row d-flex justify-content-center" v-if="students.length==0">
                <div class="col-md-6 alert alert-info text-center" role="alert" > 
                    Non ci sono studenti per l'anno: {{ currentYear }}
                </div>
            </div>
           
            <div class="row d-flex justify-content-center" v-if="error">
                <div class="col-md-6 alert alert-danger text-center" role="alert" > 
                    {{ error }}
                </div>
            </div>
            
            <Popup v-if="showPopup" @close-popup="closePopup()">
                <StudentUpload v-if="showFileBrowser" :school="school"  @storedStudent="onStoredStudent" />
                <StudentCreate v-else :school="school" @storedStudent="onStoredStudent" />
            </Popup>
            
           

            <span v-html="schoolInfo"></span>

            <DataTable v-for="d in Object.keys(filteredStudents)" :header="d" :data="filteredStudents[d]" :dataKeys="['name','surname','email']" :colHeaderKeys="['Nome','Cognome','Email']" :deleteCallback="doDeleteStudent" />
        
    </div>
</template>

<script>
import { onMounted,ref,computed,watch } from 'vue'
import useStudent from '@/composables/student.composable'
import useSchool from '@/composables/school.composable'
import DataTable from '@/components/DataTable.vue'
import Popup from '@/components/Popup.vue'
import StudentCreate from './StudentCreate.vue'
import StudentUpload from './StudentUpload.vue'
import { useRoute } from "vue-router"



export default {
    props: {
        schoolId: {
            type: String,
            required: true
        }
    },
    setup(props) {

        const { errors, students, getStudents, destroyStudent, error } = useStudent();
        const { getSchoolPartecipationYears, schoolYears,getSchool,school} = useSchool();
        const showPopup   = ref(false);
        const showFileBrowser=ref(false)
        const working     = ref(false)
        const route=useRoute()

        onMounted(async () => {
            getSchool(props.schoolId)
            getStudents(props.schoolId)
            //getSchoolPartecipationYears(props.schoolId)
        });

        watch(route, (to) => {
            // TODO
            getSchool(props.schoolId)
            getStudents(props.schoolId)
        })

       

            
        const currentYear=computed(()=>{
           
            let sy=schoolYears.value.find(sy=>sy.id==route.params.schoolId)
            return sy?.year || new Date().getFullYear()
            
        })

        const filteredStudents = computed(() => {
            let all = students.value;
            let discipline={}
                all.forEach(s=>{
                    if(!discipline[s.disciplina])
                    {
                        discipline[s.disciplina]=[]
                    }
                    discipline[s.disciplina].push(s)
                }
            )
            return discipline
        });

        const closePopup= () => { showPopup.value=false }

        const doDeleteStudent = async (student) => {
            let { id, name, surname } = student;
            if (!window.confirm(`Si è sicuri di voler eliminare lo studente ${name} ${surname}?`)) return;
            await destroyStudent(id);
            await getStudents(props.schoolId);
        };

        const onStoredStudent=()=>{
            showPopup.value=false
            getStudents(props.schoolId);
        }
        const schoolInfo=computed(()=>{
            
            let sd=school.value
            if(!sd.school_json_data) return
            sd=JSON.parse(sd.school_json_data)
            return `<p style="margin:30px;">
                       <h5>${sd.sc_tab_plesso}</h5>
                       ${sd.sc_tab_indirizzo} 
                    </p>`
        })

        return {
            props,
            error,
            showPopup,
            currentYear,
            closePopup,
            schoolYears,
            doDeleteStudent,
            showFileBrowser,
            onStoredStudent,
            errors,
            working,
            school,
            filteredStudents,
            students,
            route,
            schoolInfo
            
        };
    },
    components: { StudentCreate, DataTable, Popup, StudentUpload }
}
</script>

