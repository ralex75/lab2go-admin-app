<template>
    
    <Popup v-if="showCreateUser" @close-popup="showCreateUser=false">
        <CreateUser @userCreated="onUserCreated" />
    </Popup>

    

    <div class="col-md-6">
    <button class="btn btn-primary" @click="showCreateUser=true" >Nuovo utente</button>
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

import { ref,onMounted} from 'vue';
import Popup from '@/components/Popup.vue'
import useUserAccount from '@/composables/accounts.composable';
import CreateUser from '@/components/account/CreateUser.vue'
import roles from '../roles'

const {getAccounts,accounts,account,updateAccount} =useUserAccount()

const mappedAccounts=ref([])
const showCreateUser=ref(false)

onMounted(async ()=>{
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
})

const onUserCreated=async ()=>{
    showCreateUser.value=false
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
}


const doSave=(u)=>{
    let {email,selectedRole}=u
    updateAccount(email,selectedRole).then(_=>{
        u.role=account.value.role
    })
   
}
</script>