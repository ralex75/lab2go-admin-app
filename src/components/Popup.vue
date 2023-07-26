<template>
    <div class="overlay">
       
        <div class="popup">
            <div class="close" @click="emit('closePopup')"></div>
            <div class="body"><slot /></div>
        </div>
    </div>
</template>

<script setup>

const emit = defineEmits(['closePopup'])

</script>

<style scoped>
    .overlay{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(100,100, 100, 0.7);
        z-index: 1000;
    }

    .popup{

        position: absolute;
        top:50%;
        left: 50%;
        min-width: 200px;
        background-color: whitesmoke;
        padding: 20px 10px;
        transform: translate(-50%,-50%);
        border: 0px solid red;
        border-radius: 10px;
        
    }

    
    .close::after{
        position: absolute;
        content: '\2715';
        right: 10px;
        top:10px;
        cursor: pointer;
    }

    .body{
        padding: 20px 10px;
    }
</style>