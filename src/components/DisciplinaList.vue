<template>
   
    <select class="form-select" required aria-label="Default select example" v-model="selectedDisciplina">
        <option selected value="" v-if="discipline.length>1 && !selectedDisciplina">Seleziona disciplina</option>
        <option v-for="d in discipline" :value="d">{{ d }}</option>
    </select>
</template>
<script setup>

import {computed,ref} from "vue"

const selectedDisciplina=ref("")

const props=defineProps({
    "discipline":{type:String,required:true}
})


const discipline=computed(()=>{
    
    let discipline=props.discipline ? JSON.parse(props.discipline) : {}
    let keys=Object.keys(discipline)
    if(keys.length==1){
        selectedDisciplina.value=keys[0]
    }
    return Object.keys(discipline)
})

defineExpose({
  selectedDisciplina
})

</script>