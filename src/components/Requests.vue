<template>
    <component :is="selectedComponent"></component>
</template>

<script setup>

import useUser from '@/composables/user.composable'
import { defineAsyncComponent,computed } from 'vue';
const {user}=useUser()

const selectedComponent =computed(()=>{
    let comp='./request/user/RequestIndex.vue'
    if(user.value.role.toLowerCase()=='admin')
    {
        comp='./request/admin/RequestIndex.vue'
    }
    return defineAsyncComponent(()=>import(comp))
}) 


</script>