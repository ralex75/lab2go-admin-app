<template>
  
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <div class="navbar-header">
          <img src="@/assets/images/image1.png" style="width: 50px;">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        
        <UserMenu />
       
      </div>
    </nav>
    
    <div class="d-flex justify-content-center gap-5" style="margin:20px 0">
      <img v-for="img in images" :src="img"   class="rounded logo" alt="...">
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
    import { onMounted } from 'vue';
    
    import UserMenu from './components/UserMenu.vue';
    import useImageHeader from '@/composables/images.composable'
    
    
    const {images,loadImages}=useImageHeader(Array.from({length:6},(_,i)=>{ return `image${i+1}.png`}))

    onMounted(loadImages)
  
  </script>
  
  
  <style>
  .logo{
    
    height: auto;
    max-height: 100px;
  }

  input[type=text]:read-only,textarea:read-only{
    background-color: #DDD;
    color: #000;
    pointer-events: none;
  }
  
  :deep(ul.discipline){
        list-style-type:decimal;
        margin: 0;
        padding: 0;
        padding-left: 20px;
  }
  
  </style>