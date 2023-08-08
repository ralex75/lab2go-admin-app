<template>
    
    <Popup v-if="selectedComponent" @close-popup="closePopup()">
        <component :is="selectedComponent.cmp" :args="selectedComponent.args" @updated-request="updatedRequest" @close-popup="closePopup()"></component>
    </Popup>
    
   
   
    <div class="col-md-6 alert alert-danger text-center" role="alert" v-if="error"> 
       {{error}}
    </div>



    <div class="row d-flex justify-content-center" v-if="requests.length==0">
            <div class="col-md-6 alert alert-info text-center" role="alert" > 
                Non ci sono richieste di partecipazione al momento.
            </div>
    </div>
    
   
    

    <div class="container-fluid" v-else >
    
       
    <div class="col-md-4" v-if="isAdmin">
        <RequestFilter v-if="requests.length>0" @dofilter="applyFilter($event)" />
    </div>
       
    <div class="col-md-6 alert alert-info text-center" role="alert" v-if="filterChanged && filteredRequests?.length==0"> 
        Non ci sono richieste con il filtro selezionato
    </div>

    <table class="table">
        <thead>
            <tr>
                <th colspan="6" style="text-align: left;">
                    <h6>Numero di richieste attuali: <b>{{ requests.length }}</b></h6>
                </th>
                <th colspan="2" style="text-align: left;">
                    <input type="button" @click="doFinalize()" :disabled="!someToFinalize" class="mb-6 btn w-100 btn-lg" :class="{'btn-success':someToFinalize,'btn-light':!someToFinalize}"  value="Finalizza" />
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
    import RequestFilter from '@/components/request/RequestFilter.vue'
    import RequestEdit from './RequestEdit.vue'
    import RequestNotes from '@/components/request/RequestNotes.vue'
    import utils from '@/utils'
    import Popup from '@/components/Popup.vue'
    import useUser from '@/composables/user.composable'
    
    import { ref, onMounted, shallowRef,computed } from 'vue'

    export default {
        name:'RequestIndex',
        setup(){
            
            const {isAdmin}=useUser()
            const {requests,getRequests,finalize,error} = useRequest()
            const filteredRequests=ref([])
            const filterChanged=ref(false)
            const selectedComponent=shallowRef(null)
            const showFilter=ref(false)
                      

            const getAllRequests=()=>{
                 //solo amministratore può vedere tutte le richieste
                 getRequests().then(_=>{
                    filteredRequests.value=Object.assign(requests.value)
                })
            }

            const someToFinalize=computed(()=>{
                return filteredRequests.value.filter(r=>r.status!='SUBMITTED').length
            })

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
                
                let req=requests.value.find(r=>r.id==ureq.id)
                req.user_json_data=JSON.parse(ureq.user_json_data)
                req.disci_accepted=JSON.parse(ureq.disci_accepted)
                req.status=ureq.status
                closePopup()
            }

            const doFinalize=async ()=>{
                finalize().then(_=>getAllRequests())
         
            }

            onMounted(getAllRequests)
          
            return {
                requests,
                filteredRequests,
                filterChanged,
                isAdmin,
                showPopup,
                closePopup,
                selectedComponent,
                utils,
                formatDiscipline,
                applyFilter,
                showFilter,
                updatedRequest,
                someToFinalize,
                doFinalize,
                error
            }
        },
        components:{Popup,RequestFilter,RequestEdit,RequestNotes}
       
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