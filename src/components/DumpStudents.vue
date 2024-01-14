<template>
    <div class="container">
        <h4>DUMP Studenti</h4>
        <div class="form-group">
            <label>Scuola</label>
            <input type="text" class="form-control" readonly :value="schools" />
        </div>
        <div class="form-group">
            <label>Studenti</label>
            <select v-model="ddump.status" class="form-select" @change="">
                <option value="ALL">Tutti</option>
                <option value="1">Attivi</option>
                <option value="0">Eliminati</option>
            </select>
        </div>
        <div>
            <label for="startDate">Dal</label>
            <input id="startDate" class="form-control" :disabled="ddump.status=='ALL'" type="date" v-model="ddump.sdate" />
            <span id="startDateSelected"></span>
        </div>
        <br>
        <div class="form-group">
            <button type="button"  class="btn btn-outline-success" style="width: 50%;" @click="doDumpStudents()" >Dump</button>
        </div>

    </div>
</template>

<script setup>
import { ref,reactive,computed } from 'vue';
import useUtils from '@/composables/utils.composable';
import moment from 'moment'

const { dumpStudents } = useUtils()
const props=defineProps({"schoolId":{type:Number,required:true}})
const ddump=reactive({"status":"ALL",'sdate':moment().format("YYYY")-1})

const schools=computed(()=>{
    return !props.schoolId ? "Tutte" : "Singola"
})
   
const doDumpStudents=()=>{
       dumpStudents(props.schoolId,ddump)
}

</script>