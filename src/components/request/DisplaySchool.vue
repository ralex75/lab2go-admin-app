<template>
    <div>
        {{  school }}
        <!--<ul>
            <li><span>Istituto Principale:</span>{{ school.sch_name }}</li>
            <li><span>Plesso:</span>{{ school.plesso_name }}</li>
            <li><span>Indirizzo:</span>{{ school.sch_address }}</li>
            <li><span>Telefono:</span>{{ school.phone }}</li>
            <li><span>Email:</span>{{ school.email }}</li>
        </ul>-->
    </div>
</template>
<script setup>

    const props = defineProps({
        school: Object,
    })


</script>

<style scoped>
    ul{
        list-style-type: none;
        border: 1px solid red;
        width: 400px;
    }
    
    li:nth-child(1){
        text-align: right;
        width: 100px;
        border: 1px solid yellow;
    }
    li:nth-child(2){
        width: 300px;
        text-align: left;
        border: 1px solid saddlebrown;
    }
    li:nth-child(3){
        width: 300px;
        text-align: left;
        border: 1px solid saddlebrown;
    }
</style>