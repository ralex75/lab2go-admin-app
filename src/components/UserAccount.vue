<template>
    
    <Popup v-if="showSignup" @close-popup="showSignup=false">
        <Signup @userCreated="onUserCreated" />
    </Popup>

       
    <div class="col-md-6">
        <div class="row">
            <div class="alert  text-center" :class="{'alert-info':!downloadDBError,'alert-danger':downloadDBError}" role="alert" v-if="showFeedback"> 
                {{feedbackMsg}}
            </div>
        </div>
        <div class="command-actions">
            <button class="btn btn-primary" @click="showSignup=true" >Nuovo utente</button>
            <button class="btn btn-success" @click="doDumpDB()" >DB Download</button>
        </div>
    <br><br>
    <table class="table">
        <thead>
            <tr>
                <th>Email</th>
                <th>Ruolo corrente</th>
                <th>Nuovo Ruolo</th>
                <th>Azione</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="u in mappedAccounts" :key="u.email">
                <td>{{ u.email }}</td>
                <td>{{ u.role }}</td>
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

import { ref,onMounted,computed} from 'vue';
import Popup from '@/components/Popup.vue'
import useUserAccount from '@/composables/accounts.composable';
import useUtils from '@/composables/utils.composable';
import Signup from '@/components/account/Signup.vue'
import roles from '../roles'

const {getAccounts,accounts,account,updateAccount} =useUserAccount()
const {dumpDB,error:downloadDBError}=useUtils()

const mappedAccounts=ref([])
const showSignup=ref(false)
const showFeedback = ref(false)
const feedbackMsg=computed(()=>{
    return !downloadDBError.value ? 'Download DB completato': downloadDBError.value
})

onMounted(async ()=>{
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
})

const onUserCreated=async ()=>{
    showSignup.value=false
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
}


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