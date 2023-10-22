<template>

<table class="table" style="table-layout: fixed;">
    <thead>
        <tr>
           <th :colspan="colSpanCount" v-if="props.header">
                {{ props.header }} ({{ props.data?.length }})
           </th>
        </tr>
        <tr>
           <th v-for="k of props.colHeaderKeys">
                {{ k }}
           </th>
           <th v-if="hasAction">
                <input type="button" class="btn btn-success w-100" value="Aggiungi" @click="props.addCallback">
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="r in props.data" :key="r.id">
            <td v-for="k in props.dataKeys">
                {{ r[k] }}
            </td>
            <td v-if="hasAction" class="action">
                <input type="button" v-if="props.editCallback" @click="props.editCallback(r)" value="Modifica" class="btn btn-primary w-100">
                <input type="button" v-if="props.deleteCallback" :disabled="props.allowDeleteKey && !r[props.allowDeleteKey]" @click="props.deleteCallback(r)" value="Elimina" class="btn btn-danger w-100">
            </td>
        </tr>
    </tbody>
</table>

</template>
<script setup>
import { ref,computed,useAttrs } from 'vue';

const emits=defineEmits(["delete"])


const props=defineProps({
    "header":String,
    "colHeaderKeys":{type:Array,required:true},
    "addCallback":{type:Function},
    "editCallback":{type:Function},
    "deleteCallback":{type:Function},
    "data":{type:Array,required:true},
    "dataKeys":{type:Array,required:true},
    "allowDeleteKey":{type:String,required:false}
    
})

const colSpanCount=computed(()=>{
    return props.colHeaderKeys.length + (hasAction.value ? 1 : 0)
})

const hasAction=computed(()=>{
    return props.deleteCallback || props.editCallback
    
})

</script>

<style scoped>
.action{
    display: flex;
    gap:10px
}
</style>