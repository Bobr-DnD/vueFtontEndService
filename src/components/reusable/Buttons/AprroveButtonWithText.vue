<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div
        class="p-2 bg-greenish-dark md:hover:bg-greenish-dark/75 text-center rounded-xl border-2 border-darkred-dark text-darkred-light font-medium md:hover:cursor-pointer select-none">
        {{ text }}</div>
</template>