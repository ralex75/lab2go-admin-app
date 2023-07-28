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
                <p class="info">{{ usr_data.name }}</p>
            </div>
            <div class="form-group large">
                <label>Cognome</label>
                <p class="info">{{ usr_data.surname }}</p>
            </div>
            
            <div class="form-group">
                <label>Indirizzo mail</label>
                <p class="info">{{ usr_data.email }}</p>
            </div>
            <div class="form-group">
                <label>Ulteriori Indirizzi mail</label>
                <input type="text" class="form-control" v-model="usr_data.emailAlt" />
            </div>
            
            <div>
                      
                <DisciplineSelection :discipline="discipline" @change="onDisciplineChanged" />
                
            </div>
                      
            </div>
            
        </div>
        
</div>
<div class="d-flex align-items-center justify-content-center">
    <div class="col-md-6">
        <div class="d-grid gap-2 ">
             <input type="button" @click="update()" :disabled="!dataIsChanged" class="btn w-100  btn-lg btn-danger" value="Aggiorna"  />
        </div>
    </div>
    
</div>
</template>

<script setup>
import { computed, reactive,ref } from 'vue';
import useRequest  from '@/composables/request.helper'
import useUser from '@/composables/user.composable';
import DisciplineSelection from './DisciplineSelection.vue';

const props=defineProps(['args'])
const {updateRequest}=useRequest()

const request=props.args

//deep copy
const requestCpy=reactive(JSON.parse(JSON.stringify(request)))
const sch_data=requestCpy.school_json_data
const usr_data=requestCpy.user_json_data
const discipline=usr_data.discipline

const emit=defineEmits(['closePopup','updatedRequest'])

const Institute=computed(()=>{
    return `<span>${sch_data.sc_tab_istituto}</span> <span>${sch_data.code}</span>`
})
const Plesso=computed(()=>{
    return `<span>${sch_data.sc_tab_plesso}</span> <span>${sch_data.sc_tab_plesso_code}</span>`
})

const dataIsChanged=computed(()=>{
    
    const src_user_data=request.user_json_data

    if(!usr_data.discipline[0]) return false
   
    for(let k in src_user_data){
        if(JSON.stringify(src_user_data[k])!=JSON.stringify(usr_data[k])) 
        {   
            return true
        }
    }
    return false
})

const onDisciplineChanged=(discipline)=>{
    
    usr_data.discipline[0]=discipline[0]
    console.log(usr_data.discipline)
    console.log(request.user_json_data.discipline)
}

const closePopup=()=>{
    emit('closePopup')
}

const doUpdateRequest=async(status="UNDEFINED")=>{
    try {
        
        let {id,user_json_data,disci_accepted}=requestCpy
        if(status=='REJECTED' || status=='SUBMITTED'){ disci_accepted=[]}
        await updateRequest(id,user_json_data,disci_accepted,status)
        requestCpy.status=status
        requestCpy.disci_accepted=disci_accepted
        emit('updatedRequest',requestCpy)
    }
    catch(exc){
        throw exc
    }
}



const update=async()=>{
    
   
    let discipline=Object.values(usr_data.discipline)
    let dis_acc=Object.values(disci_accepted.value)
    
    //riordina
    dis_acc=discipline.filter(d=>dis_acc.indexOf(d)>-1)

    requestCpy.disci_accepted=dis_acc
    
    if(requestCpy.disci_accepted.length==0) return

    //doUpdateRequest('ACCEPTED')
}



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