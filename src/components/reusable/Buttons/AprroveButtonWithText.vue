<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <button
        class="p-2 bg-state-success md:hover:bg-state-success/75 text-center rounded-xl border-2 border-brand-base text-brand-text font-medium">
        {{ text }}</button>
</template>