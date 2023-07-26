<template>
    <div>
        
        {{  user }}
        
    </div>
</template>
<script setup>

    const props = defineProps({
        user: Object,
    })


</script>

<style scoped>
    ul{
        list-style-type: none;
        border: 1px solid red;
        width: 200px;
    }
    ul li:nth-child(1){
        width: 100px;
        text-align: right;
        border: 1px solid green;
    }
    ul li:nth-child(1){
        width: 100px;
        text-align: left;
        border: 1px solid green;
    }
</style>