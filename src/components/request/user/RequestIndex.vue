<template>
    
    

    <h3 v-if="requests.length==0">Non ci sono richieste</h3>
    
   
    <Popup v-if="selectedComponent" @close-popup="closePopup()">
        <component :is="selectedComponent.cmp" :args="selectedComponent.args" @updated-request="updatedRequest" @close-popup="closePopup()"></component>
    </Popup>
    
       
    <div class="container-fluid">
    
    <table class="table">
        <thead>
            <tr>
                <th colspan="4" style="font-weight: normal;" >
                    <router-link class="nav-link" to="/requests/add"><font-awesome-icon :icon="['fa', 'plus']" size="2xl" style="color:dodgerblue" /> Nuova Richiesta</router-link>
                </th>
                <th colspan="4" style="text-align: right;">
                    <h6 v-if="requests.length>0">Numero di richieste attuali: <b>{{ requests.length }}</b></h6>
                </th>
            </tr>
            <tr>
                <th>ID</th>
                <th>Istituto Principale</th>
                <th>Plesso</th>
                <th>Provincia - Regione</th>
                <th>Discipline Richieste</th>
                <th>Discipline Accettate</th>
                <th>Stato</th>
                <th>Azione</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="r in filteredRequests" :key="r.id">
                <td>{{ r.id }}</td>
                <td>{{ r.school_json_data.sc_tab_istituto }}<br><span class="fs-6">{{ r.school_mec_code }}</span></td>
                <td>{{ r.school_json_data.sc_tab_plesso }}<br><span class="fs-6">{{ r.plesso_mec_code }}</span></td>
                <td>{{ parseZone(r.plesso_mec_code) }}</td>
                <td><span v-html="formatDiscipline(r.user_json_data.discipline)"></span></td>
                <td><span v-html="formatDiscipline(r.disci_accepted)"></span></td>
                <td>{{ r.status }}</td>
                <td class="action">
                    <span style="color:green"><font-awesome-icon icon="fa-solid fa-eye" title="visualizza richiesta" @click="showPopup(r,'REQUEST')" /></span>
                    <span v-if="r.user_json_data.notes" style="color:dodgerblue"><font-awesome-icon icon="fa-solid fa-info-circle" title="mostra note" @click="showPopup(r.user_json_data.notes,'NOTES')"  /></span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
    import useRequest from '@/composables/request.helper'
    import DisplaySchool from './DisplaySchool.vue'
    import DisplayUser from './DisplayUser.vue'
    import RequestFilter from './RequestFilter.vue'
    import RequestEdit from './RequestEdit.vue'
    import RequestNotes from './RequestNotes.vue'
    import data from '@/assets/regioni.json' 
    import Popup from '../Popup.vue'
    import userHelper from '@/composables/user.helper'
    
    import { ref, onMounted, shallowRef } from 'vue'

    export default {
        name:'RequestIndex',
        setup(){
            
            const {isAdmin}=userHelper()
            const {requests,getRequests} = useRequest()
            const filteredRequests=ref([])
            const filterChanged=ref(false)
            const selectedComponent=shallowRef(null)
            const showFilter=ref(false)

            const regioni=data
            onMounted(()=>{
                
                //solo amministratore può vedere tutte le richieste
                if(!isAdmin.value) return

                getRequests().then(_=>{
                    filteredRequests.value=Object.assign(requests.value)
                })
                
            })

            const parseZone=(meccode)=>{
               
                let prov=meccode.substring(0,2)
                let reg=regioni.filter(r=>r.province.indexOf(prov)>-1)[0]
                let city=reg.capoluoghi[reg.province.indexOf(prov)]
                return `${city} - ${reg.nome}`

            }

            const applyFilter = ({term,disc})=>{
                
                filterChanged.value=true
                filteredRequests.value=Object.assign(requests.value)
                let items=filteredRequests.value

                if(term)
                {
                    term=term.toLowerCase()
                    items=items.filter(i=>JSON.stringify(i.school_json_data).toLowerCase().indexOf(term)>-1 || JSON.stringify(i.user_json_data).toLowerCase().indexOf(term)>-1)
                }
                
                if(disc.item!=''){
                    
                    items=items.filter(i=>i.user_json_data.discipline.indexOf(disc.item)>-1)
                    if(disc.pos!=""){
                        items=items.filter(i=>i.user_json_data.discipline[disc.pos]==disc.item)
                    }
                }

                filteredRequests.value=items
            }

            const formatDiscipline=(discipline)=>{
                
                return discipline?.length > 0  ? "<ul class='discipline'>"+discipline.map(d=>`<li>${d}</li>`).join("")+"</ul>" : 'Nessuna'
            }

           
            const showPopup=(args,type)=>{
                let cmp={"NOTES":RequestNotes,"REQUEST":RequestEdit}
               
                selectedComponent.value={'cmp':cmp[type],args}
            }

            const closePopup=()=>{
                selectedComponent.value=null
            }

            const updatedRequest=(ureq)=>{
                
                let idx=requests.value.findIndex(r=>r.id==ureq.id)
                requests.value[idx]=ureq
                closePopup()
            }
          
            return {
                requests,
                filteredRequests,
                filterChanged,
                isAdmin,
                showPopup,
                closePopup,
                selectedComponent,
                parseZone,
                formatDiscipline,
                applyFilter,
                showFilter,
                updatedRequest
            }
        },
        components:{DisplaySchool,DisplayUser,Popup,RequestFilter,RequestEdit,RequestNotes}
       
    }
</script>

<style scoped>
    :deep(ul.discipline){
        list-style-type:decimal;
        margin: 0;
        padding: 0;
        padding-left: 20px;
    }

    td.action span{
        margin:0 5px;
    }
  
    .box{
        border: 1px solid #DDD;
        border-radius: 10px;
    }

    .box.hide{
        padding: 10px;
    }

    .row-margin{
        margin: 6px 0;
    }

    .col-border {
        border: 1px solid #DDD;
        border-radius: 10px;
        padding: 20px 20px 10px 20px;
    }
    
</style>