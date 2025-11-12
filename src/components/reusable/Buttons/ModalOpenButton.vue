<script setup>
const props = defineProps({
    text: {
        type :String,
        required: true
    }
})
</script>

<template>
    <button class="border-4 border-darkred-dark rounded-lg bg-darkred-dark_gray text-darkred-light font-gothic w-fit py-2 px-3 text-xl">
        {{ props.text }}
    </button>
</template>