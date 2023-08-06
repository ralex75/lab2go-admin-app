<template>

<table class="table">
    <thead>
        <tr>
           <th :colspan="props.colHeaderKeys.length" v-if="props.header">
                {{ props.header }}
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
                <input type="button" v-if="props.onDelete" value="Elimina" class="btn btn-danger">
            </td>
        </tr>
    </tbody>
</table>

</template>
<script setup>
import { ref,computed } from 'vue';

const props=defineProps({
    "header":String,
    "colHeaderKeys":{type:Array,required:true},
    "onCreate":{type:Object},
    "onDelete":{type:Object},
    "data":{type:Array,required:true},
    "dataKeys":{type:Array,required:true}
    
})

const hasAction=computed(()=>{
    return props.onCreate || props.onDelete
})

</script>