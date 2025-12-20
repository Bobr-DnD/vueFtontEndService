<script setup>

const props = defineProps({
    label: {
        type: String,
        required: true
    }
})

</script>

<template>
    <h1 class="text-xl font-gothic">{{ props.label }}</h1>
</template>