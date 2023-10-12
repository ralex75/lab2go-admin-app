<template>

<div class="container">
    <h4>Impostazioni di Applicazione</h4>
    <br>
    <div class="form-group">
        <label>Limite di data per nuova richiesta</label>
        <input id="allowRequestChange" class="form-control" type="date" v-model="settings.allow_new_edit_request_date" />
        <span id="startDateSelected"></span>
    </div>
    <div class="form-group">
        <label>Limite di data per accettazione richiesta</label>
        <input id="allowSchoolChange" class="form-control" type="date" v-model="settings.allow_edit_school_untilAt" />
        <span id="startDateSelected"></span>
    </div>
    <div class="form-group">
        <label>Permetti il Finalize per singola richiesta</label>
        <select v-model="settings.allow_single_finalize" class="form-select"  >
                <option v-for="o in options" :value="o.value">
                    {{ o.text }}
                </option>
        </select>
    </div>
    <br>
    <div class="text-center">
        <button class="btn btn-primary w-100" @click="doSave()" >Salva</button>
    </div>    
</div>


</template>

<script setup>

import useSettings from '@/composables/settings.composable'
import {ref,onMounted} from 'vue'

const {getAllSettings,saveSettings,settings}=useSettings()
const emit=defineEmits(["onSettingsSaved"])
const options=[{"value":"0","text":"No"},{"value":"1","text":"Si"}]
onMounted(getAllSettings)

const doSave=()=>{
    saveSettings().then(_=>{
        emit("onSettingsSaved")
    })
}

</script>

<style scoped>
.form-group{
    margin: 6px 20px;
}
</style>