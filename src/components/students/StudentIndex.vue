<template>
    <div class="block-container">
            <section v-if="working">
                <h1>Aggiornamento dei dati in corso....</h1>
            </section>
            <section v-if="!working">
            <DisplayErrors :errors="errors"/>
            <h3 v-if="filteredStudents.length==0" class="message warning">
                Non ci sono studenti per l'anno: {{ currentYear }}
            </h3>

            <div class="navig-link">
                <a href="" :class="{'selected':year==currentYear}" @click.prevent="currentYear=year" v-for="year in studentsYears">Anno: {{ year }}</a>
            </div>  

            <!--<StudentCreate :school-id="schoolId" @storedStudent="storedStudent"></StudentCreate> -->
            <!--<FileBrowser v-if="showPopup" :title="popupTitle" @close="showPopup=false" @upload="doUpload"></FileBrowser>-->
            <br>
           
            <table>
                <thead>
                    <tr>
                        <th colspan="2">
                                <div>Studenti registrati per l'anno: {{ currentYear }}</div>
                        </th>
                        <th>
                            <div class="form-group inline gap" v-if="currentYear==new Date().getUTCFullYear()"  >
                                    <router-link :to="{name:'students.add',params:{id:schoolId}}" class="link-as-button">Aggiungi</router-link>
                                    <button  type="button" class="btn btn-upload" @click.prevent="showUploadPopup()">Aggiungi da File</button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="info" v-for="item in filteredStudents" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.surname }}</td>
                        <td class="col-md">
                            <div class="form-group inline gap" >
                                <button type="button" class="btn btn-danger" @click.prevent="doDeleteStudent(item)">Elimina</button>
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
import studentHelper from '@/composables/student.helper';
import StudentCreate from './StudentCreate.vue';
import DisplayErrors from '../DisplayErrors.vue';
import FileBrowser from '../FileBrowser.vue';


export default {
    props: {
        schoolId: {
            type: String,
            required: true
        },
    },
    setup(props) {
        const { errors, students, getStudents, destroyStudent,uploadStudentsList } = studentHelper();
        const currentYear = ref(2023);
        const popupTitle="Seleziona il file con la lista degli studenti da caricare"
        let showPopup=ref(false)
        const working=ref(false)
        let studentsYears=ref([])
        
        onMounted(async ()=>{

           
            await getStudents(props.schoolId,currentYear.value);
            let years=students.value.map(s=>s.schoolStudentYears.map(y=>y.year))
            years.push(new Date().getUTCFullYear())
            years=new Set(years.flat(1))
            studentsYears.value=[...years]
            
        })


        const filteredStudents=computed(()=>{
            let all=students.value
            return all.filter(s=>s.schoolStudentYears.map(y=>y.year).indexOf(currentYear.value)>-1)
        })
        
        const doDeleteStudent = async (student) => {
            let { id, name, surname } = student;
            if (!window.confirm(`Si è sicuri di voler eliminare lo studente ${name} ${surname}?`))
                return;
            await destroyStudent(id);
            await getStudents(props.schoolId);
        };

        const doUpload=async (file)=>{
            try{
                working.value=true
                await uploadStudentsList(file,props.schoolId)
                students.value.length=0
                setTimeout(async ()=>{
                    await getStudents(props.schoolId)
                    working.value=false
                },2000)
                
            }
            catch(exc)
            {}
            finally
            {
                showUploadPopup()
            }
        }

       
        const showUploadPopup=()=>{
            showPopup.value=!showPopup.value
        }

        const storedStudent=(student)=>{
            students.value.push(student)
        }

       
        return {

            filteredStudents,
            currentYear,
            showPopup,
            popupTitle,
            doDeleteStudent,
            storedStudent,
            showUploadPopup,
            doUpload,
            errors,
            working,
            studentsYears
     
        };
    },
    components: { StudentCreate, FileBrowser, DisplayErrors }
}
</script>

<style scoped>
    .navig-link{
        display: flex;
        flex-direction: column;
        gap:10px
    }

    .inline{
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .navig-link a{
        padding: 10px;
        
    }

    a.selected{
        text-decoration: none;
        background-color: #34454d;
        color:#DDD;
        pointer-events: none;
    }
</style>