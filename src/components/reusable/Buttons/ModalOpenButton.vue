<script setup>
const props = defineProps({
    text: {
        type :String,
        required: true
    }
})
</script>

<template>
    <button class="p-4 rounded-lg bg-darkred-dark_gray text-darkred-light font-gothic w-fit text-xl">
        {{ props.text }}
    </button>
</template>