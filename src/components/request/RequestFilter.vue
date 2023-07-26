<template>
    <div>
        <div class="form-group">
            <label>Ricerca</label>
            <input type="text" class="form-control" v-model="term" @input="applyFilter()" placeholder="ricerca...">
        </div>
        <div class="form-group">
            <label>Disciplina</label>
            <select v-model="disc.item" class="form-select" @change="applyFilter()" >
                <option value="">Qualsiasi</option>
                <option v-for="d in discipline" :key="d.value" :value="d.text">
                    {{ d.text }}
                </option>
            </select>
        </div>
        <div class="form-group">
            <label>Posizione</label>
            <select v-model="disc.pos" :disabled="disc.item==''" class="form-select" @change="applyFilter()">
                <option value="">Qualsiasi</option>
                <option value="0">Prima</option>
                <option value="1">Seconda</option>
                <option value="2">Terza</option>
            </select>
        </div>
        <!--<button :class="{'btn-primary':isValid}" :disabled="!isValid" @click="applyFilter()">Applica</button>-->
    </div>
</template>

<script setup>
    import discipline from '@/assets/discipline.json'
    import { ref,reactive,computed } from 'vue';
    const emit = defineEmits(['dofilter'])
    const term=ref("")
    const disc=reactive({"item":"","pos":""})
    const isValid=computed(()=>{
        return term.value!="" || disc.item!=""
    })

    const applyFilter=()=>{
        emit('dofilter',{'term':term.value,disc})
    }
   
</script>
