<template>
    
    <h1 v-if="!user">Logout avvenuto con successo.</h1>
   
</template>

<script setup>
import { onMounted } from 'vue'
import useUser from '@/composables/user.composable'


const {signOut,user}=useUser()

onMounted(signOut)

</script>