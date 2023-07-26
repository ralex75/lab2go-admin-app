<template>
  
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <div class="navbar-header">
          <img src="@/assets/images/image1.png" style="width: 50px;">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link> </li>
              <li class="nav-item"><router-link class="nav-link" to="/accounts">Accounts</router-link> </li>
              <li class="nav-item"><router-link class="nav-link" to="/requests" v-if="isLoggedIn">Richieste</router-link> </li>
              <li class="nav-item"><router-link class="nav-link" to="/about">About</router-link></li>
            </ul>
            <ul class="nav navbar-nav ms-auto navbar-right" >
  
                  <li class="nav-item">
                      <router-link v-if="!user && path!='/login'" class="btn btn-outline-primary btn-margin-right" to="/login">Accedi</router-link>
                      <router-link v-if="user" class="btn btn-outline-primary btn-margin-right" to="/logout">Esci</router-link>
                  </li>
                  <li class="nav-item"><router-link v-if="!user && path!='/signup'"  class="btn btn-outline-success btn-margin-right" to="/signup">Registrati</router-link></li>
            </ul>
        </div>
      </div>
    </nav>
    
    <div class="d-flex justify-content-center gap-5" style="margin:20px 0">
      <img v-for="img in images" :src="img" style="height:100px;" class="rounded" alt="...">
    </div>
   
    <div class="container-fluid">
          <div class="row justify-content-md-center" >
              <div class="col-md-12" >
                  <PageInfo></PageInfo>
              </div>
          </div>
          <div class="row justify-content-md-center">
                  <router-view />
          </div>
    </div>
  </template>
  
  
    
  <script setup>
    
    import PageInfo from '@/components/PageInfo.vue';
    import { computed,onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import useUser from './composables/user.composable';
    import useImageHeader from '@/composables/images.composable'
    
    const route=useRoute();
  
    const path = computed(() =>route.path)
    
    const {currentUser,isLoggedIn,isAdmin,user}=useUser()
  
    const {images,loadImages}=useImageHeader(Array.from({length:6},(_,i)=>{ return `image${i+1}.png`}))

    onMounted(()=>{loadImages(); currentUser()})
  
  </script>
  
  
   
  
  <style>
  
    *{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-size: 18px;
      font-family: 'Roboto', sans-serif;
    }
  
    .btn-margin-right{
      margin:0 5px;
    }
  
    #nav {
    padding: 10px;
  }
  
  #nav a {
    font-weight: bold;
    color: dodgerblue;
    border: 1px solid red;
  }
  
  #nav a.router-link-exact-active {
    color: dodgerblue;
  }
  
  .container-margin{
    margin: 20px 0;
  }
    
  
  </style>