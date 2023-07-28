<template>
    <div class="col-md-6">
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
                    <select v-model="u.selectedRole">
                       <option v-for="r in roles" :value="r.v">{{ r.txt }}</option>
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
import useUserAccount from '@/composables/accounts.composable';


const roles=[{'v':'','txt':'BLOCCATO'},{'v':'DOCENTE','txt':'DOCENTE'},{'v':'ADMIN','txt':'ADMIN'},{'v':'SUPER-ADMIN','txt':'SUPER-ADMIN'}]
const {getAccounts,accounts,account,updateAccount} =useUserAccount()

const mappedAccounts=ref([])

onMounted(async ()=>{
    await getAccounts()
    mappedAccounts.value=accounts.value.map(a=>({...a,...{"selectedRole":a.role}}))
})


const doSave=(u)=>{
    let {email,selectedRole}=u
    updateAccount(email,selectedRole).then(_=>{
        u.role=account.value.role
    })
   
}
</script>