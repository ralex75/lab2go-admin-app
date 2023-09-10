<template>
    <component :is="selectedComponent"></component>
</template>

<script setup>

import useUser from '@/composables/user.composable'
import { defineAsyncComponent,computed } from 'vue';
import UserRequestIndex from './request/user/RequestIndex.vue'
import AdminRequestIndex from './request/admin/RequestIndex.vue'
const {user}=useUser()

const selectedComponent =computed(()=>{
    const requestView={
        "user":UserRequestIndex,
        "admin":AdminRequestIndex
    }
    
    //mostra la view corretta in base al ruolo
    let role=user.value.role.toLowerCase()
    let comp=requestView[role] || requestView.user
    
    return comp
}) 


</script>