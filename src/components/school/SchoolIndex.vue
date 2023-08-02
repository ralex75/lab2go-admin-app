<template>
        <div>
           
            <table class="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Indirizzo</th>
                        <th>Sezione</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="info" v-for="s in schools" :key="s.id">
                        <td>{{ s.data.sc_tab_plesso }}</td>
                        <td>{{ s.data.sc_tab_indirizzo }}</td>
                        <td>{{ utils.parseZone(s.data.sc_tab_plesso_code) }}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-ms" @click.prevent="editSchool(s.id)">Modifica</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

</template>


<script setup>

    import {onMounted} from 'vue'
    import PageInfo from '../PageInfo.vue';
    import { useRouter } from 'vue-router';
    import useSchool from '@/composables/school.composable';
    import useUser from '@/composables/user.composable'
    import utils from '@/utils.js'
    //import search from '../search.vue';
       
    const router = useRouter()
    const { schools, getSchools, deleteSchool } = useSchool();
    const { user }=useUser()
        
    onMounted(getSchools);
    
    const doDeleteSchool = async (id) => {
        if (!window.confirm("Sei sicuro?")) return;
        await deleteSchool(id);
        await getSchools();
    };

    const editSchool=(id)=>{
        router.push({name:'schools.edit',params:{id:id}})
    }

    const doSearch=(value)=>{
        getSchools({"keyword":value})
    }
    

</script>


