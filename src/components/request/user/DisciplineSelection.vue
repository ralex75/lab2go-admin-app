<template>
    <label>Discipline</label>
        <div class="col-md-6">
            <hr>
            <div class="mb-3">
                <label>Prima preferenza</label>
                <select  class="form-select" v-model="selectedDisci1" :class="{'is-invalid':!selectedDisci1 }" >
                    <option value="">Nessuna</option>
                    <option v-for="d in disciList1"  :value="d" >{{d.text}}</option>
                </select>
                <div class="invalid-feedback">
                        Disciplina non selezionata
                </div>
            </div>
            <div class="mb-3">
                <label>Seconda preferenza</label>
                <select class="form-select" v-model="selectedDisci2" :disabled="!selectedDisci1">
                    <option value="">Nessuna</option>
                    <option v-for="d in disciList2" :value="d" >{{d.text}}</option>
                </select>
            </div>
            <div class="mb-3">
                
                <label>Terza preferenza</label>
                <select class="form-select" v-model="selectedDisci3" :disabled="!selectedDisci1" >
                    <option value="">Nessuna</option>
                    <option v-for="d in disciList3" :value="d" >{{d.text}}</option>
                </select>
            </div>
        </div>
</template>

<script setup>
import {ref,computed,watch} from 'vue'

const props=defineProps({'discipline':Array})

const discipline=[
  {"value":1,"text":"Biologia Animale"},
  {"value":2,"text":"Biologia Vegetale"},
  {"value":3,"text":"Chimica"},
  {"value":4,"text":"Fisica"},
  {"value":5,"text":"Musei Scientifici"},
  {"value":6,"text":"Robotica"},
  {"value":7,"text":"Scienze della Terra"} ]


const disciList1=computed(()=>{
  return discipline.filter(d=>d.value!=selectedDisci2.value?.value && d.value!=selectedDisci3.value?.value)
})

const disciList2=computed(()=>{
  return discipline.filter(d=>d.value!=selectedDisci1.value?.value && d.value!=selectedDisci3.value?.value)
})

const disciList3=computed(()=>{
  return discipline.filter(d=>d.value!=selectedDisci1.value.value && d.value!=selectedDisci2.value?.value)
})

const selectedDisci1=ref(discipline.find(d=>d.text==props.discipline[0]))
const selectedDisci2=ref(discipline.find(d=>d.text==props.discipline[1]) || "")
const selectedDisci3=ref(discipline.find(d=>d.text==props.discipline[2]) || "")

const emit=defineEmits(['change'])

watch([selectedDisci1,selectedDisci2,selectedDisci3], (newConfig) => {
    // your code
    emit('change',[selectedDisci1.value.text,selectedDisci2.value.text,selectedDisci3.value.text])

});



</script>