<template>
    
    <div class="container">
        
        <div class="section">
            <h2>Istituto</h2>
            <br>
            <div class="form-group">
                <label>Principale</label>
                <p class="info" v-html="Institute"></p>
            </div>
            <div class="form-group">
                <label>Plesso/Scuola</label>
                <p class="info" v-html="Plesso"></p>
            </div>
            <div class="form-group">
                <label>Indirizzo</label>
                <p class="info">{{ sch_data.sc_tab_indirizzo }}</p>
            </div>
            <div class="form-group">
                <label>Telefono</label>
                <p class="info">{{ sch_data.sc_tab_telefono }}</p>
            </div>
            <div class="form-group">
                <label>Indirizzo mail</label>
                <p class="info">{{ sch_data.sc_tab_email }}</p>
            </div>
        </div>
        

        <div class="section usr-info">
            <div class="separator"></div>
            <div style="width:100%;">
            <h2>Richiedente</h2>
            <br>
            <div class="form-group large">
                <label>Nome</label>
                <input type="text" class="form-control" :disabled="!canUpdateData" v-model="usr_data.name" />
            </div>
            <div class="form-group large">
                <label>Cognome</label>
                <input type="text" class="form-control" :disabled="!canUpdateData" v-model="usr_data.surname" />
            </div>
            
            <div class="form-group">
                <label>Indirizzo mail</label>
                <input type="text" class="form-control" :disabled="!canUpdateData" v-model="usr_data.email" />
            </div>
            <div class="form-group">
                <label>Ulteriori Indirizzi mail</label>
                <input type="text" class="form-control" :disabled="!canUpdateData" v-model="usr_data.emailAlt" />
            </div>
            <div class="form-group">
                <label>Note</label>
                <textarea class="form-control" :disabled="!canUpdateData" style="resize: none;" id="exampleFormControlTextarea1" rows="3" v-model="usr_data.notes"></textarea>
            </div>
            <div>
                <label>Discipline (in ordine di preferenza)</label>
              
                <section class="discipline" v-for="(d,index) in discipline" :key="index">
                    
                    <input type="checkbox" :disabled="!canUpdateData" v-model="disci_accepted" :value="d" />
                    
                    <label for="checkbox">{{ d }}</label>
                    
                </section>
            </div>
                      
        </div>
            
    </div>
        
</div>
<div class="d-flex align-items-center justify-content-center">
    <div class="col-md-6">
        <div v-if="request.status=='PENDING'" class="row gap-3">
            <input type="button" class="col btn btn-success w-100 btn-lg" @click="doUpdateRequest('SUBMITTED')" value="Sottometti">
            <!--<input type="button" class="col btn btn-warning w-100 btn-lg" @click="doUpdateRequest('PENDING')"  value="Rimetti in PENDING">-->
            <input type="button" class="col btn btn-danger w-100 btn-lg" @click="doUpdateRequest('DISCARDED')"  value="Scarta">
        </div>
        <div v-else-if="request.status!='DISCARDED'" class="d-grid gap-2 ">
            <input type="button" @click="restoreRequest()" :disabled="request.status=='SUBMITTED'" class="mb-6 btn w-100 btn-lg" :class="{'btn-warning':request.status!='SUBMITTED'}"  value="Ripristina" />
           
            <input type="button" @click="acceptRequest('INFN')" :disabled="acceptButtonIsDisabled" class="mb-6 btn w-100 btn-lg" :class="{'btn-primary':disci_accepted.length}" value="Accetta come INFN" />
            <input type="button" @click="acceptRequest('USAP')" :disabled="acceptButtonIsDisabled" class="mb-6 btn w-100 btn-lg" :class="{'btn-info':disci_accepted.length}" value="Accetta come Sapienza" />
            
            <input type="button" @click="rejectRequest()" class="btn w-100  btn-lg btn-danger" value="Rifiuta"  />
        </div>
    </div>
</div>
</template>

<script setup>
import { computed, reactive,ref } from 'vue';
import useRequest  from '@/composables/request.composable'
import useUser from '@/composables/user.composable';
import utils from '@/utils.js'

const props=defineProps(['args'])
const {saveRequest}=useRequest()
const {isAdmin}=useUser()

const request=props.args

//deep copy
const requestCpy=reactive(JSON.parse(JSON.stringify(request)))
const sch_data=requestCpy.school_json_data
const usr_data=requestCpy.user_json_data
const discipline=usr_data.discipline
const disci_accepted=ref(requestCpy.disci_accepted || [])
const emit=defineEmits(['closePopup','updatedRequest'])

const acceptButtonIsDisabled=computed(()=>{
    return !disci_accepted.value.length
})
const Institute=computed(()=>{
    return `<span>${sch_data.sc_tab_istituto}</span> <span>${sch_data.sc_tab_code}</span>`
})
const Plesso=computed(()=>{
    return `<span>${sch_data.sc_tab_plesso}</span> <span>${sch_data.sc_tab_plesso_code}</span>`
})

const canUpdateData=computed(()=>{
    return request.status!="DISCARDED" && request.status!="PENDING"
})


const doUpdateRequest=async(status="UNDEFINED")=>{
    try {
        if(!utils.statusMap[status]) return
        let {id,user_json_data,disci_accepted}=requestCpy
        let ureq=await saveRequest(id,user_json_data,disci_accepted,status)
        emit('updatedRequest',ureq)
    }
    catch(exc){
        throw exc
    }
}

//ripristina a SUBMITTED
const restoreRequest=()=>{
   
   doUpdateRequest('SUBMITTED')

}

//accetta la richiesta 
const acceptRequest=async(acceptAs)=>{
    
   
    let discipline=Object.values(usr_data.discipline)
    let dis_acc=Object.values(disci_accepted.value)
    
    //riordina
    dis_acc=discipline.filter(d=>dis_acc.indexOf(d)>-1)

    requestCpy.disci_accepted=dis_acc
    
    if(requestCpy.disci_accepted.length==0) return

    doUpdateRequest(`ACCEPTED_${acceptAs}`)
}

const rejectRequest=()=>{
   
    doUpdateRequest('REJECTED')

}

const dataIsChanged=computed(()=>{
    
    const src_usr_data=request.user_json_data

    console.log(disci_accepted.value)
    console.log(usr_data.discipline)
    //JSON.stringify(disci_accepted.value)!=JSON.stringify(usr_data.discipline)) return true
    //if(disci_accepted.lenght > !usr_data.discipline[0]) return false
   
    for(let k in usr_data){
        if(JSON.stringify(usr_data[k])!=JSON.stringify(src_usr_data[k])) 
        {   
            return true
        }
    }
    return false
})

</script>

<style scoped>
    .container{
        
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 900px;
        min-height: 600px;
        gap:5px;
        border: 0px solid red;
    }

    .container div.section:nth-child(1){
       
       width: 50%;
       

   }
    .container div.section:nth-child(2){
       
        width: 50%;
       
      
    }
    .form-group{
        margin: 10px 0;
    }
   
    .discipline{
        margin: 6px 0;
    }

    .discipline input[type='checkbox']{
        margin: 10px;
        padding: 10px;
        -ms-transform: scale(2); /* IE */
        -moz-transform: scale(2); /* FF */
        -webkit-transform: scale(2); /* Safari and Chrome */
        -o-transform: scale(2); /* Opera */
        transform: scale(2);
        
    }

   .separator{
        background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 48%, rgba(255,255,255,1) 100%);
        width: 3px;
        height: 100%;
        margin: 10px;
    }

    h1,h2,h3,h4,h5,h6{
        border-bottom: 1px solid #DDD;
        
        color: #888;
    }

    .usr-info{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap:5px;
        
    }

    .form-group label{
        color: #888;
    }

    p.info{
        margin: 0;
    }
    
    /* deep direttiva vue si usa quando lo style è scoped e si fa uso di v-html per il bind di stringa html*/
    :deep(p.info span) {
        display: block;
       
    }

    :deep(p.info span:nth-child(2)){
        font-size: 0.9rem;
        line-height: 1.0rem;
    }
</style>