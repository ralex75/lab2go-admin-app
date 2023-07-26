<template>
  <div v-if="user">
  <h4>Hi {{ user.fullname }} !</h4>
  </div>
  <br>
  <h2>Welcome to the Lab2GO Page</h2>
</template>

<script>

// @ is an alias to /src
import useUser from '@/composables/user.composable';

export default {
  name: 'HomeView',
  setup(){
    const { user }=useUser()

    return{
      user
    }
  }
  
  
}
</script>
