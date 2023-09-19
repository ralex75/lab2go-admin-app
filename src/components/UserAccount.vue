<template>
    
    <Popup v-if="showPopup" @close-popup="closePopup">
        <Signup @onUserCreated="onUserCreated" v-if="popup.signup" />
        <Settings @onSettingsSaved="onSettingsSaved" v-if="popup.settings" />
    </Popup>

    
    
    
       
    <div class="col-md-6">
        <div class="row">
            <div class="alert  text-center" :class="{'alert-info':!downloadDBError,'alert-danger':downloadDBError}" role="alert" v-if="showFeedback"> 
                {{feedbackMsg}}
            </div>
        </div>
        <div class="command-actions">
            <button class="btn btn-primary" @click="popup.signup=true" >Nuovo utente</button>
            <button class="btn btn-success" @click="doDumpDB()" >DB Download</button>
            <button class="btn btn-secondary" @click="popup.settings=true" >Impostazioni</button>
        </div>
    <br><br>
    <table class="table">
        <thead>
            <tr>
                <th><input type="text" class="form-control" placeholder="email" v-model="filter.email" /></th>
                <th>
                    <select class="form-select" v-model="filter.role">
                       <option value="">Tutti</option>
                       <option v-for="r in roles" :value="r">{{ r }}</option>
                    </select>
                </th>
                <th></th>
                <th></th>
            </tr>
            <tr>
                <th>Email</th>
                <th>Ruolo</th>
                <th>Nuovo Ruolo</th>
                <th>Azione</th>
            </tr>
           
        </thead>
        <tbody>
            <tr v-for="u in filteredAccounts" :key="u.email">
                <td class="align-middle">{{ u.email }}</td>
                <td class="align-middle">{{ u.role }}</td>
                <td>
                    <select v-model="u.selectedRole" class="form-select">
                       <option v-for="r in roles" :value="r">{{ r }}</option>
                    </select>
                </td>
                <td>
                    <button class="btn" @click="doSave(u)" :disabled="u.selectedRole==u.role" :class="{'btn-primary':u.selectedRole!=u.role}" >Salva</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>
<script setup>

import { ref,onMounted,computed,reactive} from 'vue';
import Popup from '@/components/Popup.vue'
import useUserAccount from '@/composables/accounts.composable';
import useUtils from '@/composables/utils.composable';
import Signup from '@/components/account/Signup.vue'
import Settings from './Settings.vue';
import roles from '../roles'

const {getAccounts,accounts,account,updateAccount} =useUserAccount()
const {dumpDB,error:downloadDBError}=useUtils()

const popup=reactive({"signup":false,"settings":false})
const filter=reactive({"email":"","role":""})
const mappedAccounts=ref([])
const showFeedback = ref(false)

const showPopup=computed(()=>{
    return Object.values(popup).some(i=>i)
})

const feedbackMsg=computed(()=>{
    return !downloadDBError.value ? 'Download DB completato': downloadDBError.value
})

const closePopup=()=>{
    Object.keys(popup).forEach(k=>popup[k]=false)
}


onMounted(async ()=>{
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
})

const onUserCreated=async ()=>{
    showSignup.value=false
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
}

const onSettingsSaved=()=>{
    popup.settings=false
}

const filteredAccounts=computed(()=>{
    let ma=mappedAccounts.value
    if(filter.role)
    {
       ma=ma.filter(a=>a.role==filter.role)
    }
    if(filter.email)
    {
       ma=ma.filter(a=>a.email.indexOf(filter.email)>-1)
    }

    return ma
})

const doSave=(u)=>{
    let {email,selectedRole}=u
    updateAccount(email,selectedRole).then(_=>{
        u.role=account.value.role
    })
   
}

const doDumpDB=()=>{
    showFeedback.value=false
    dumpDB().then(_=>showFeedback.value=true)
}

</script>

<style scoped>

.command-actions{
    display: flex;
    justify-content: flex-start;
    vertical-align: middle;
    gap: 6px;
}

</style>