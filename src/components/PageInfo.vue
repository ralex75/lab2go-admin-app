<template>
    <div class="page-info">
        <h1>{{ $route.meta.title || info.title }}</h1>
        <h3>{{ $route.meta.subtitle || info.subtitle}}</h3>
        <p>{{ $route.meta.description || info.description }}</p>
    </div>  
</template>




<script>
    import pageInfoHelper from '@/composables/pageinfo.helper';

    import { onMounted,onUpdated } from 'vue';
    import { useRouter } from 'vue-router';


    export default {
        setup(){
            const {info,setInfo}=pageInfoHelper()
            const router=useRouter()
          
            onUpdated(()=>{
               let meta=router.currentRoute.value.meta
               console.log("Meta:",meta)
               if(meta.title) {setInfo(meta)}
            })

            return{
                info
            }
        }
        
        
        
    }
</script>

<style scoped>
    .page-info{
       
        padding-bottom: 20px;
        border: 0px solid red;
        text-align: center;
    }
    p{
        font-size: 1rem;
        color: #545454;
       
    }

   
</style>