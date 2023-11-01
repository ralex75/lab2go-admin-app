<template>
        <div>
            <Popup v-if="selectedSchoolId!=null" @close-popup="selectedSchoolId=null" >
                <SchoolEdit v-if="show=='school'" :schoolId="selectedSchoolId" @school-updated="selectedSchoolId=null" /> 
                <DumpStudents v-if="show=='dump'" :schoolId="selectedSchoolId" />
            </Popup>
            

            <div class="row d-flex justify-content-center" v-if="schools.length==0">
                <div class="col-md-6 alert alert-info text-center" role="alert" > 
                    Non ci sono scuole ammesse al momento per l'anno corrente.
                </div>
            </div>
            <div v-else>
                <div class="col-4" style="margin: 10px 0;">
                    <label>Ricerca</label>
                    <input type="text" class="form-control" v-model="term" @input="applyFilter()" placeholder="ricerca...">
                </div>    
           
            <table class="table" >
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Indirizzo</th>
                        <th>Sezione</th>
                        <th>Discipline</th>
                        <th>Stato</th>
                        <th>      
                            <button type="button"  class="btn btn-outline-success" v-if="isAdmin" style="width: 50%;" @click.prevent="showDumpStudents(0)">Dump</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="info" v-for="s in filteredSchools" :key="s.id">
                        <td>{{ s.data.sc_tab_plesso }}</td>
                        <td>{{ s.data.sc_tab_indirizzo }}</td>
                        <td>{{ utils.parseZone(s.data.sc_tab_plesso_code) }}</td>
                        <td><span v-html="utils.formatDiscipline(Object.keys(s.discipline))"></span></td>
                        <td v-if="s.status=='CONFIRMED'">CONFERMATO</td>
                            
                        <td v-else><a href="#link" class="btn btn-outline-primary" @click.prevent="doConfirmSchool(s)" role="button">Conferma Partecipazione</a></td>
                        <td>
                            
                            <div class="action" v-if="isAdmin">
                                
                                
                                <button type="button" :disabled="!s.students.length" class="btn btn-outline-success" v-if="isAdmin" @click.prevent="showDumpStudents(s.id)">Dump</button>
                                <button type="button" class="btn btn-primary btn-ms" @click.prevent="showEditSchool(s.id)">Modifica</button>
                                <router-link class="btn btn-outline-primary" :to="{ name: 'student.index', params: { 'schoolId': s.id }}">Studenti</router-link>

                            </div>
                            <div class="action" v-else-if="isDocente">
                                
                                <section v-if="s.status=='CONFIRMED'">
                                    <button type="button" class="btn btn-primary btn-ms" @click.prevent="showEditSchool(s.id)">Modifica</button>
                                    <router-link class="btn btn-outline-primary" :to="{ name: 'student.index', params: { 'schoolId': s.id }}">Studenti</router-link>
                                </section> 

                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>

</template>


<script setup>

    import {onMounted,ref,computed} from 'vue'
    
    import useSchool from '@/composables/school.composable';
    import roles from '@/roles';
    import utils from '@/utils.js'
    import Popup from '@/components/Popup.vue'
    import SchoolEdit from '@/components/school/SchoolEdit.vue'
    import DumpStudents from '../DumpStudents.vue';
    import useUser from '@/composables/user.composable';
    
    const { schools, getSchools,confirmSchool} = useSchool();
    const {user,isAdmin,isCoordinator,isDocente}=useUser()
    
    const selectedSchoolId=ref(null)
    const show=ref("")

    const filteredSchools=ref([])
    const term=ref("")
    onMounted(()=>{
        getSchools().then(_=>{
                filteredSchools.value=schools.value
            })
    });
        
    const showEditSchool=(id)=>{
        show.value='school'
        selectedSchoolId.value=id
    }

    const doConfirmSchool=(s)=>{
        confirmSchool(s).then(res=>{
            getSchools()
        })
    }

    const showDumpStudents=(id=0)=>{
        show.value='dump'
        selectedSchoolId.value=id
    }

    const applyFilter=()=>{
        filteredSchools.value=schools.value.filter(v=>JSON.stringify(v).toLowerCase().indexOf(term.value.toLowerCase())>-1)
    }
  
</script>

<style scoped>
:deep(ul.discipline){
        list-style-type:decimal;
        margin: 0;
        padding: 0;
        padding-left: 20px;
  }
  .action, div.action section{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
