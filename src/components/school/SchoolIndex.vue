<template>
        <div>
            <Popup v-if="selectedSchoolId" @close-popup="selectedSchoolId=null">
                <SchoolEdit :schoolId="selectedSchoolId" @onSchoolUpdated="selectedSchoolId=null" /> 
            </Popup>

            <div class="row d-flex justify-content-center" v-if="schools.length==0">
                <div class="col-md-6 alert alert-info text-center" role="alert" > 
                    Non ci sono scuole ammesse al momento per l'anno corrente.
                </div>
            </div>
            <table class="table" v-else>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Indirizzo</th>
                        <th>Sezione</th>
                        <th>Discipline</th>
                        <th>      
                            <button type="button"  class="btn btn-outline-success" style="width: 50%;" @click.prevent="doDumpStudents(0)">Dump</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="info" v-for="s in schools" :key="s.id">
                        <td>{{ s.data.sc_tab_plesso }}</td>
                        <td>{{ s.data.sc_tab_indirizzo }}</td>
                        <td>{{ utils.parseZone(s.data.sc_tab_plesso_code) }}</td>
                        <td><span v-html="utils.formatDiscipline(s.discipline)"></span></td>
                        <td>
                          
                            <div class="action">
                                <button type="button" :disabled="!s.students.length" class="btn btn-outline-success" @click.prevent="doDumpStudents(s.id)">Dump</button>
                                <button type="button" class="btn btn-primary btn-ms" @click.prevent="editSchool(s.id)">Modifica</button>
                                <router-link class="btn btn-outline-primary" :to="{ name: 'student.index', params: { 'schoolId': s.id }}">Studenti</router-link>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

</template>


<script setup>

    import {onMounted,ref} from 'vue'
    
    import useSchool from '@/composables/school.composable';
    import useUser from '@/composables/user.composable'
    import utils from '@/utils.js'
    import useUtils from '@/composables/utils.composable';
    import Popup from '@/components/Popup.vue'
    import SchoolEdit from '@/components/school/SchoolEdit.vue'
       
    
    const { schools, getSchools, deleteSchool } = useSchool();
    const { dumpStudents } = useUtils()
    const { user }=useUser()
    const selectedSchoolId=ref(null)
        
    onMounted(getSchools);
    
    const currentYear=new Date().getFullYear()

    const editSchool=(id)=>{
        selectedSchoolId.value=id
    }

    /*const doDeleteSchool = async (id) => {
        if (!window.confirm("Sei sicuro?")) return;
        await deleteSchool(id);
        await getSchools();
    };

    

    const doSearch=(value)=>{
        getSchools({"keyword":value})
    }*/
    
    const doDumpStudents=(schoolId)=>{
        dumpStudents(schoolId)
    }

</script>

<style scoped>
:deep(ul.discipline){
        list-style-type:decimal;
        margin: 0;
        padding: 0;
        padding-left: 20px;
  }
  .action{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
