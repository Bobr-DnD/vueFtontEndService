<script setup>
const emit = defineEmits(['deleteRow'])

function deleteRow(){
    emit('deleteRow')
}
</script>

<template>
    <div @click="deleteRow"
        class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer hover:bg-darkred-bright transition select-none">
        ✕
    </div>
</template>