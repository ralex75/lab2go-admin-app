<template>
  
  
   <div class="col-md-4">
        <form @submit.prevent="login()" >
            <div class="mb-3">
                <label for="email" class="form-label">Indirizzo email</label>
                <input type="email" id="email" required="true" v-model="form.email" class="form-control" :class="{'form-control':true, 'is-invalid' : (!validEmail && blur.email) || error,  'is-valid':validEmail}" @keydown="error=''" @blur="blur.email=true" />
                <div :class="{'invalid-feedback':!validEmail || error!='','hide':validEmail}">
                       Email non valido.
                </div>
            </div>
            <div class="mb-3">
                  
                    <label for="inputPassword" class="form-label">Password </label>
                    <div class="input-group has-validation">
                        <input type="password" required="true" max-lenght="20" min-length="8" v-model="form.password" id="inputPassword" :class="{'form-control':true, 'is-invalid' : (!validPassword && blur.password) || error}" @keydown="error=''" @blur="blur.password=true" class="form-control">
                        <div :class="{'invalid-feedback':!validPassword,'hide':validPassword}">
                        Password non valida.
                        </div>
                    </div>
                   
            </div>
            
            <div class="alert alert-danger mt-6 text-center" role="alert" v-if="error"> 
                {{error}}
            </div>

            <div class="d-grid gap-2">
                <button type="submit" :disabled="working" class="btn btn-primary btn-lg">Accedi</button>
            </div>
        </form>
       
   </div>
</template>

<script setup>

import { reactive,computed } from 'vue';
import useUser from '@/composables/user.composable'

    
    const userChanged=defineEmits(['userchanged'])
    const {signIn, error, working}=useUser()
        
    const form=reactive({"email":"","password":""})
    const blur=reactive({"email":false,"password":false})
    

    const validEmail=computed(()=>{
        const regex_email=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex_email.test(form.email)
    })
  

    const validPassword=computed(()=>{
              
        return true
    })

    const login=()=>{
       
        if(!validEmail.value || !validPassword.value){
            return console.log("Invalid")
        } 

       
        signIn(form)
        
    }
</script>

<style scoped>
    .hide{
        display: none;
    }

    
    
</style>