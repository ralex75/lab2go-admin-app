<template>
    <Popup v-if="popup.show" @close-popup="popup.show=false">
        <TutorEdit :tutor="popup.data" @onSavedTutor="onSavedTutor" />
    </Popup>

   
    <div class="container" v-if="tutors">
          <DataTable header="Lista dei tutors" :data="tutors" :dataKeys="['name','email']" :colHeaderKeys="['Nome','Email']" :addCallback="doAdd" :deleteCallback="doDelete" :editCallback="doEdit" />
    </div>
</template>

<script setup>
import useTutor from '@/composables/tutor.composable'
import DataTable from "@/components/DataTable.vue"
import TutorEdit from '@/components/tutors/TutorEdit.vue'
import Popup from '@/components/Popup.vue'

import {ref,onMounted,reactive} from 'vue'

const {tutors,error,getTutors,deleteTutor}=useTutor()
const popup=reactive({"show":false,"data":null})

onMounted(getTutors)

const doDelete=(d)=>{
    deleteTutor(d.id).then(_=>{
        let idx=tutors.value.findIndex(t=>t.id==d.id)
        tutors.value.splice(idx,1)
    })
}

const doAdd=()=>{
    popup.data=null
    popup.show=true
}

const onSavedTutor=(tutor)=>{
    popup.show=false
    getTutors()
}

const doEdit=(d)=>{
   console.log(d)
    popup.data=d
    popup.show=true
}

</script>