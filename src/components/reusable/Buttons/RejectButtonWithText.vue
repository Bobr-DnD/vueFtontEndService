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
        class="p-2 bg-state-error md:hover:bg-state-error/75 rounded-xl border-2 border-brand-base text-brand-text font-medium md:hover:cursor-pointer select-none flex justify-center items-center">
        {{ props.text }}
</button>
</template>