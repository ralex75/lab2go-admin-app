<template>
    <div class="container-fluid " style="width: 400px;">
        <h5 class="text-center">Nuovo Tutor</h5>
        <form @submit.prevent="doSaveTutor()">
            <div class="col-md-12">
                <div class="form-group">
                    <label>Nome completo</label>
                    <input type="text" class="form-control" v-model="form.name" />
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" class="form-control" v-model="form.email" />
                </div>
                <br>
                <input type="submit" class="btn btn-primary w-100" value="Salva">
            </div>
        </form>
    </div>
</template>

<script setup>
import {ref,reactive,watchEffect} from 'vue'
import useTutor from '@/composables/tutor.composable'

const props=defineProps({"tutor":{type:Object}})



const {saveTutor}=useTutor()
const emit=defineEmits(["onSavedTutor"])
const form=reactive({"id":null,"name":"","email":""})

watchEffect(()=>{
    if(!props.tutor) return
    
    let {createdAt,updatedAt,...tutor}=props.tutor
    Object.assign(form,tutor)
   
})

const doSaveTutor=()=>{
    saveTutor(form).then(_=>{
        emit('onSavedTutor',form)
    })
}

</script>