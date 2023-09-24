<template>
    
    

    <h3 v-if="requests.length==0">Non ci sono richieste</h3>
    
   
    <Popup v-if="selectedComponent" @close-popup="closePopup()">
        <component :is="selectedComponent.cmp" :args="selectedComponent.args" @updated-request="updatedRequest" @close-popup="closePopup()"></component>
    </Popup>
    
       
    <div class="container-fluid">
    
    <table class="table">
        <thead>
            <tr>
                <th colspan="8" style="text-align: left;">
                    <h6>Numero di richieste attuali: <b>{{ requests.length }}</b></h6>
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
                <td>{{ utils.parseZone(r.plesso_mec_code) }}</td>
                <td><span v-html="formatDiscipline(r.user_json_data.discipline)"></span></td>
                <td><span v-if="statusIsCommitted(r.status)" v-html="formatDiscipline(r.disci_accepted)"></span></td>
                <td>{{ parseStatus(r.status) }}</td>
                <td class="action">
                    <a href="" v-if="canUpdate(r.status)" @click.prevent="showPopup(r,'REQUEST')">Gestisci</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
    import useRequest from '@/composables/request.composable'
    import RequestEdit from './RequestEdit.vue'
    import Popup from '@/components/Popup.vue'
    import { ref, onMounted, shallowRef } from 'vue'
    import utils from '@/utils'
    import useAppSettings from '@/composables/settings.composable'


    export default {
        name:'RequestIndex',
        setup(){
            
          
            const {requests,getRequests} = useRequest()
            const {allowEditRequest,getAllSettings}=useAppSettings()
            const filteredRequests=ref([])
            const selectedComponent=shallowRef(null)
            
            onMounted(()=>{
              
                getRequests().then(_=>{
                    filteredRequests.value=Object.assign(requests.value)
                })

                getAllSettings()
                
            })

            //deadline 31-10-2023
            const canUpdate=(status)=>{
                return status=='SUBMITTED' && allowEditRequest //in formato US
            }

           

            const parseStatus=(status)=>{
                
                //utente non deve vedere le modifiche dello stato temporaneo alla tabella
                //solo quando sono COMMITTED può vedere lo stato che è stato deciso per la sua richiesta
                return utils.statusMap[status]
            }

            const statusIsCommitted=(status)=>{
                return status.indexOf("_COMMIT")>-1
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
                let cmp={"NOTES":"","REQUEST":RequestEdit}
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
                showPopup,
                closePopup,
                selectedComponent,
                utils,
                formatDiscipline,
                updatedRequest,
                canUpdate,
                parseStatus,
                statusIsCommitted
            }
        },
        components:{Popup,RequestEdit}
       
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