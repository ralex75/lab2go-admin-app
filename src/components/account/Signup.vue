<template>
   
   <div class="container" style="width:600px">
    <h4 class="text-center">{{headerText}}</h4>
    <br>
   
   <div class="col-xl">
        <div class="alert alert-danger text-center" role="alert" v-if="error"> 
            {{error}}
        </div>
        <form @submit.prevent="save()">
            <div class="mb-3">
                <label for="name" class="form-label">*Nome</label>
                <input type="text" id="name" required="true" v-model="form.name" class="form-control" :class="{'form-control':true, 'is-invalid' : !validName && blur.name, 'is-valid':validName}" @blur="blur.name=true" />
                <div :class="{'invalid-feedback':!validName,'hide':validName}">
                       Nome non valido.
                </div>
            </div>
            <div class="mb-3">
                <label for="surname" class="form-label">*Cognome</label>
                <input type="text" id="surname" required="true" v-model="form.surname" class="form-control" :class="{'form-control':true, 'is-invalid' : !validSurname && blur.surname, 'is-valid':validSurname}" @blur="blur.surname=true" />
                <div :class="{'invalid-feedback':!validSurname,'hide':validSurname}">
                       Cognome non valido.
                </div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Indirizzo email</label>
                <input type="email" id="email" required="true" v-model="form.email" class="form-control" :class="{'form-control':true, 'is-invalid' : !validEmail && blur.email, 'is-valid':validEmail}" @blur="blur.email=true" />
                <div :class="{'invalid-feedback':!validEmail,'hide':validEmail}">
                       Email non valido.
                </div>
            </div>
            <div class="mb-3">
                
                   
                <label for="inputPassword" class="form-label">Password </label>
                <div class="input-group has-validation">
                    <input type="password" :required="!props.selectedUser" max-lenght="20" min-length="8" v-model="form.password" id="inputPassword" :class="{'form-control':true, 'is-invalid' : !validPassword && blur.password, 'is-valid':validPassword}" @blur="blur.password=true" class="form-control">
                    <div :class="{'invalid-feedback':!validPassword,'hide':validPassword}">
                    Password non valida.
                    </div>
                </div>
                
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Ruolo</label>
                <select class="form-select" name="role" v-model="form.role">
                       <option value="">Tutti</option>
                       <option v-for="r in roles" :value="r">{{ r }}</option>
                    </select>
            </div>
                      
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg">Salva</button>
            </div>
        </form>
   </div>
</div>
</template>

<script setup>

import { reactive,computed,watchEffect } from 'vue';
import useUser from '@/composables/user.composable'
import roles from '@/roles'
const props=defineProps({"selectedUser":{type:Object}})
    
const emit=defineEmits(['onUserCreated'])
const {signUp,error}=useUser()
const form=reactive({"name":"", "surname":"","email":"","password":"","role":roles.DISABILITATO})
    
const blur=reactive({"name":"","surname":"","email":false,"password":false,"confirm":false})

const headerText=computed(()=>{
    return !props.selectedUser ? "Nuovo utente" : "Modifica utente"
})

watchEffect(()=>{
    Object.assign(form,props.selectedUser)
})

const validEmail=computed(()=>{
        const regex_email=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex_email.test(form.email)
})

const validName=computed(()=>{
        const regex_name=/^\w+$/
        return regex_name.test(form.name)
})

const validSurname=computed(()=>{
        const regex_name=/^([a-zA-Z]+(\s+)?)+$/
        return regex_name.test(form.surname)
})

    const validPassword=computed(()=>{
        let password=form.password
        const badLength=password.length<8 || password.length>20
        if(badLength) return false
        const regex_letters=/\w+/g
        const regex_digit=/\d+/g
        const regex_special=/^[\w&.-]+$/
       
        if(!regex_letters.test(password) || !regex_digit.test(password))
        {
            return false
        }

        if(!regex_special.test(password)){
            return false
        }

        return true
    })

    const save=()=>{
       
        if(!validEmail.value || !(validName && validSurname)){
            return console.log("Invalid")
        } 

        if(!props.selectedUser &&  !validPassword.value)
        {
            return console.log("Invalid")
        }
        if(props.selectedUser && form.password && !validPassword.value){
            return console.log("Invalid")
        }

        signUp(form,props.selectedUser?.email).then(_=>{
            emit('onUserCreated')
        })
    }
</script>

<style scoped>
    .hide{
        display: none;
    }

    
    
</style>