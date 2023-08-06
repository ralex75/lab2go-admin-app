<template>
    <div class="block-container">
            
            <ul>
                <li v-for="sy in schoolYears" :key="sy.id">
                    <a href="" style="margin-right: 10px;"   v-for="sy in schoolYears">Studenti per anno: {{ sy.year }}</a>
                    <input type="button" v-if="sy.year==2023" class="btn btn-primary" value="Aggiungi studente" @click.prevent="showPopup=true"/>
                </li>
            </ul>
           
            <div class="col-md-6 alert alert-warning text-center" role="alert" v-if="students.length==0"> 
                Non ci sono studenti per l'anno: {{ currentYear }}
            </div>
            
            <!--<FileBrowser v-if="showPopup" :title="popupTitle" @close="showPopup=false" @upload="doUpload"></FileBrowser>-->
            
            <Popup v-if="showPopup" @close-popup="closePopup()">
                <StudentCreate :schoolId="props.schoolId" @storedStudent="onStoredStudent" />
            </Popup>

            <DataTable v-for="d in Object.keys(filteredStudents)" :header="d" :data="filteredStudents[d]" :dataKeys="['name','surname','email']" :colHeaderKeys="['Nome','Cognome','Email']" :deleteCallback="doDeleteStudent" />
        
    </div>
</template>

<script>
import { onMounted,ref,computed } from 'vue'
import useStudent from '@/composables/student.composable'
import useSchool from '@/composables/school.composable'
import StudentCreate from '@/components/student/StudentCreate.vue'
import DataTable from '@/components/DataTable.vue'
import Popup from '@/components/Popup.vue'

//import StudentCreate from './StudentCreate.vue';
//import DisplayErrors from '../DisplayErrors.vue';
//import FileBrowser from '../FileBrowser.vue';


export default {
    props: {
        schoolId: {
            type: String,
            required: true
        },
    },
    setup(props) {

        const { errors, students, getStudents, destroyStudent, uploadStudentsList } = useStudent();
        const { getSchoolPartecipationYears, schoolYears } = useSchool();
        const currentYear = ref(new Date().getFullYear());
        const popupTitle  = "Seleziona il file con la lista degli studenti da caricare";
        const showPopup   = ref(false);
        const working     = ref(false);
        
        onMounted(async () => {
            getStudents(props.schoolId, currentYear.value);
            getSchoolPartecipationYears(props.schoolId);
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

        const doUpload = async (file) => {
            try {
                working.value = true;
                await uploadStudentsList(file, props.schoolId);
                students.value.length = 0;
                setTimeout(async () => {
                    await getStudents(props.schoolId);
                    working.value = false;
                }, 2000);
            }
            catch (exc) {  }
            finally {
                showUploadPopup();
            }
        };

        const showUploadPopup = () => { showPopup.value = !showPopup.value; };
        
        const onStoredStudent=()=>{
            showPopup.value=false
            getStudents(props.schoolId, currentYear.value);
        }

        return {
            props,
            currentYear,
            showPopup,
            closePopup,
            popupTitle,
            schoolYears,
            doDeleteStudent,
            showUploadPopup,
            doUpload,
            onStoredStudent,
            errors,
            working,
            filteredStudents,
            students
        };
    },
    components: { StudentCreate, DataTable,Popup }
}
</script>

