<template>
    <div class="block-container">
            <section v-if="working">
                <h1>Aggiornamento dei dati in corso....</h1>
            </section>
            <section v-if="!working">
           
           

           
            <ul>
                <li v-for="sy in schoolYears" :key="sy.id">
                    <a href=""   v-for="y in schoolYears">Studenti per anno: {{ sy.year }}</a>
                </li>
            </ul>
           

            <div class="col-md-6 alert alert-warning text-center" role="alert" v-if="students.length==0"> 
                Non ci sono studenti per l'anno: {{ currentYear }}
            </div>
            <!--<StudentCreate :school-id="schoolId" @storedStudent="storedStudent"></StudentCreate> -->
            <!--<FileBrowser v-if="showPopup" :title="popupTitle" @close="showPopup=false" @upload="doUpload"></FileBrowser>-->
            
            <StudentCreate :schoolId="props.schoolId" @storedStudent="refreshStudents" />

            <table class="table">
                <thead>
                    <tr>
                        <th colspan="3">
                                <div>Studenti registrati per l'anno: {{ currentYear }}</div>
                        </th>
                        <th>
                            <div class="form-group inline gap" v-if="currentYear==new Date().getUTCFullYear()"  >
                                    <!--<router-link :to="{name:'students.add',params:{id:schoolId}}" class="link-as-button">Aggiungi</router-link>-->
                                    <button  type="button" class="btn btn-upload" @click.prevent="showUploadPopup()">Aggiungi da File</button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>Email</th>
                        <th>Disciplina</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="info" v-for="s in students" :key="s.id">
                        <td>{{ s.name }}</td>
                        <td>{{ s.surname }}</td>
                        <td>{{ s.email }}</td>
                        <td class="col-md">
                            <div class="form-group inline gap" >
                                <button type="button" class="btn btn-danger" @click.prevent="doDeleteStudent(s)">Elimina</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<script>
import { onMounted,ref,computed } from 'vue';
import useStudent from '@/composables/student.composable';
import useSchool from '@/composables/school.composable';
import StudentCreate from './StudentCreate.vue';
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
        const popupTitle = "Seleziona il file con la lista degli studenti da caricare";
        let showPopup = ref(false);
        const working = ref(false);
        onMounted(async () => {
            getStudents(props.schoolId, currentYear.value);
            getSchoolPartecipationYears(props.schoolId);
        });
        /*const filteredStudents = computed(() => {
            let all = students.value;
            return all.filter(s => s.schoolStudentYears.map(y => y.year).indexOf(currentYear.value) > -1);
        });*/
        const doDeleteStudent = async (student) => {
            let { id, name, surname } = student;
            if (!window.confirm(`Si è sicuri di voler eliminare lo studente ${name} ${surname}?`))
                return;
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
            catch (exc) { }
            finally {
                showUploadPopup();
            }
        };
        const showUploadPopup = () => {
            showPopup.value = !showPopup.value;
        };
        
        const refreshStudents=()=>{
            getStudents(props.schoolId, currentYear.value);
        }

        return {
            props,
            currentYear,
            showPopup,
            popupTitle,
            schoolYears,
            doDeleteStudent,
            showUploadPopup,
            doUpload,
            refreshStudents,
            errors,
            working,
            students
        };
    },
    components: { StudentCreate }
}
</script>

