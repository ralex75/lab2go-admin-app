<template>
    <component :is="selectedComponent"></component>
</template>

<script setup>

import useUser from '@/composables/user.composable'
import { defineAsyncComponent,computed } from 'vue';
const {user}=useUser()

const selectedComponent =computed(()=>{
    const requestView={
        "user":'./request/user/RequestIndex.vue',
        "admin":'./request/admin/RequestIndex.vue'
    }
    
    //mostra la view corretta in base al ruolo
    let role=user.value.role.toLowerCase()
    let comp=requestView[role] || requestView.user
    
    return defineAsyncComponent(()=>import(comp))
}) 


</script>