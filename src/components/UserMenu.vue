<template>

<div class="collapse navbar-collapse" id="navbarNav">
   
        <ul class="navbar-nav">
            <li class="nav-item" v-for="i in items"><router-link class="nav-link" :to=i.path>{{i.meta.page.name}}</router-link> </li>
        </ul>
        <ul class="nav navbar-nav ms-auto navbar-right" >

                <li class="nav-item">
                    <router-link v-if="!user && path!='/login'" class="btn btn-outline-primary btn-margin-right" to="/login">Accedi</router-link>
                    <router-link v-if="user" class="btn btn-outline-primary btn-margin-right" to="/logout">Esci</router-link>
                </li>
                <!--<li class="nav-item"><router-link v-if="!user && path!='/signup'"  class="btn btn-outline-success btn-margin-right" to="/signup">Registrati</router-link></li>-->
        </ul>
</div>

</template>

<script setup>
    import useUser from '@/composables/user.composable';
    import { useRoute,useRouter } from 'vue-router';
    import { onMounted,computed } from 'vue';

    const {currentUser, user}=useUser()

    onMounted(currentUser)

    const route=useRoute();
    const router=useRouter()
  
    const path = computed(() => route.path)

    //voci di menu gestite dal ruolo utente
    const items=computed(()=>{
       
        let userRole=(user.value?.role || "");
        let routes=router.options.routes
      
        //esclude login logout e registrati
        routes=routes.filter(r=>r.meta && !["login","logout","signup"].some(path=>r.path.indexOf(path)>-1))
        
        //tutte le voci senza ruoli e quelle con cui il ruolo fa match con quello dell'utente
        routes=routes.filter(r=>!r.meta.roles || (r.meta.roles && r.meta.roles?.some(r=>userRole.indexOf(r)>-1)))
       
        

        return routes

    })


</script>