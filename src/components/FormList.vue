<script setup>


const props = defineProps({
    options:{
        type: Array,
        required: true
    }
})
</script>

<template>
    <select>
        <option value="" v-for="option in options">{{ option.name }}</option>
    </select>

</template>