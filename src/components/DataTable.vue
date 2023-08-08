<template>

<table class="table">
    <thead>
        <tr>
           <th :colspan="colSpanCount" v-if="props.header">
                {{ props.header }} ({{ props.data.length }})
           </th>
        </tr>
        <tr>
           <th v-for="k of props.colHeaderKeys">
                {{ k }}
           </th>
           <th v-if="hasAction">
                &nbsp;
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="r in props.data" :key="r.id">
            <td v-for="k in props.dataKeys">
                {{ r[k] }}
            </td>
            <td v-if="hasAction">
                <input type="button" v-if="props.deleteCallback" @click="props.deleteCallback(r)" value="Elimina" class="btn btn-danger">
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
    "deleteCallback":{type:Function},
    "data":{type:Array,required:true},
    "dataKeys":{type:Array,required:true}
    
})

const colSpanCount=computed(()=>{
    return props.colHeaderKeys.length + (hasAction.value ? 1 : 0)
})

const hasAction=computed(()=>{
    return props.deleteCallback
    
})

</script>