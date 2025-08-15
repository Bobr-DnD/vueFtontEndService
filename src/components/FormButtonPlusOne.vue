<script setup>
const value = defineModel('value', {type: Number, required:true})
const props = defineProps({
    entity_name:{
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="flex items-center justify-center w-64 h-16">
        <div class="flex items-center justify-center px-5 py-4 h-full bg-darkred-dark text-darkred-light rounded-lg">
            {{ entity_name }}: {{ value }}
        </div>
        <button @click="value++" class="text-center size-xl p-4 w-16 h-16 bg-darkred-red rounded-md">
            +
        </button>
    </div>
</template>