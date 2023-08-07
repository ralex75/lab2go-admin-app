<template>
    <div class="block-container">
            
            <ul>
                <li v-for="sy in schoolYears" :key="sy.id">
                    <a href=""   v-for="sy in schoolYears">Studenti per anno: {{ sy.year }}</a>
                    <input type="button" style="margin-left: 10px;"  v-if="sy.year==2023" class="btn btn-primary" value="Aggiungi studente" @click.prevent="showPopup=true;showFileBrowser=false"/>
                    <input type="button" style="margin-left: 10px;" v-if="sy.year==2023" class="btn btn-primary" value="Aggiungi studenti da file" @click.prevent="showPopup=true;showFileBrowser=true"/>
                </li>
            </ul>
           
            <div class="col-md-6 alert alert-warning text-center" role="alert" v-if="students.length==0"> 
                Non ci sono studenti per l'anno: {{ currentYear }}
            </div>
            
            
            
            <Popup v-if="showPopup" @close-popup="closePopup()">
                <StudentUpload v-if="showFileBrowser" :school="school"  @storedStudent="onStoredStudent" />
                <StudentCreate v-else :school="school" @storedStudent="onStoredStudent" />
            </Popup>

            <DataTable v-for="d in Object.keys(filteredStudents)" :header="d" :data="filteredStudents[d]" :dataKeys="['name','surname','email']" :colHeaderKeys="['Nome','Cognome','Email']" :deleteCallback="doDeleteStudent" />
        
    </div>
</template>

<script>
import { onMounted,ref,computed } from 'vue'
import useStudent from '@/composables/student.composable'
import useSchool from '@/composables/school.composable'
import DataTable from '@/components/DataTable.vue'
import Popup from '@/components/Popup.vue'
import StudentCreate from './StudentCreate.vue'
import StudentUpload from './StudentUpload.vue'


export default {
    props: {
        schoolId: {
            type: String,
            required: true
        },
    },
    setup(props) {

        const { errors, students, getStudents, destroyStudent } = useStudent();
        const { getSchoolPartecipationYears, schoolYears,getSchool,school} = useSchool();
        const currentYear = ref(new Date().getFullYear());
        const showPopup   = ref(false);
        const showFileBrowser=ref(false)
        const working     = ref(false)
        
        onMounted(async () => {
            getSchool(props.schoolId)
            getStudents(props.schoolId, currentYear.value)
            getSchoolPartecipationYears(props.schoolId)
        });
        
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
            getStudents(props.schoolId, currentYear.value);
        }

        return {
            props,
            currentYear,
            showPopup,
            closePopup,
            schoolYears,
            doDeleteStudent,
            showFileBrowser,
            onStoredStudent,
            errors,
            working,
            school,
            filteredStudents,
            students
        };
    },
    components: { StudentCreate, DataTable, Popup, StudentUpload }
}
</script>

