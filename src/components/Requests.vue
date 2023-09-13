<template>
    <component :is="selectedComponent"></component>
</template>

<script setup>

import useUser from '@/composables/user.composable'
import {computed } from 'vue';
import UserRequestIndex from './request/user/RequestIndex.vue'
import AdminRequestIndex from './request/admin/RequestIndex.vue'
const {user}=useUser()

const selectedComponent =computed(()=>{
    const requestView={
         "DOCENTE" :UserRequestIndex,
         "ADMIN":AdminRequestIndex,
         "COORDINATORE":AdminRequestIndex,
         "DISABILITATO":null
    }
    
    
    //mostra la view corretta in base al ruolo
    let role=user.value.role
    let comp=requestView[role] || null

    
    return comp
}) 


</script>