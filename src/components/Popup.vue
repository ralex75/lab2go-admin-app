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
        max-height: 500px;
        
    }

    /* width */
::-webkit-scrollbar {
width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
background: #888;
}
    .close::after{
        position: absolute;
        content: '\2715';
        right: 20px;
        top:10px;
        cursor: pointer;
        
    }
    .close{
        height: 20px;
    }

    .body{
        padding: 20px 10px;
        max-height: 450px;
        overflow-y: auto;
        
    }
</style>