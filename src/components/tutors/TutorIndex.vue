<template>
    <Popup v-if="popup.show" @close-popup="popup.show=false">
        <TutorEdit :tutor="popup.data" @onSavedTutor="onSavedTutor" />
    </Popup>

    <div class="col-6 text-center alert" v-if="feedback.msg" :class="{'alert-success':feedback.status=='ok','alert-danger':feedback.status=='err'}"  role="alert">
        {{ feedback.msg }}
    </div>
   
    <div class="container" v-if="tutors">
          <DataTable header="Lista dei tutors" :data="tutors" :allowDeleteKey="'allow_delete'" :dataKeys="['name','email']" :colHeaderKeys="['Nome','Email']" :addCallback="doAdd" :deleteCallback="doDelete" :editCallback="doEdit" />
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
const feedback=reactive({"msg":"","status":""})

onMounted(getTutors)

const doDelete=(d)=>{
    deleteTutor(d.id).then(_=>{
        let idx=tutors.value.findIndex(t=>t.id==d.id)
        let tutor=tutors.value[idx]
        tutors.value.splice(idx,1)
        feedback.msg=`Il tutor ${tutor.name} è stato rimosso`
        feedback.status="ok"
    })
    .catch(err=>{
        feedback.msg=`Si è verificato un problema. ${err?.msg || err}`
        feedback.status="err"
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