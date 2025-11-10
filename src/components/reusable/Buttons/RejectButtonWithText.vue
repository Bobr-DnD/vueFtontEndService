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
        class="p-2 bg-darkred-red hover:bg-darkred-bright rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer select-none text-center">
        {{ props.text }}
    </div>
</template>