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
        class="p-2 bg-greenish-dark hover:bg-greenish-mid text-center rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer select-none">
        {{ text }}</div>
</template>