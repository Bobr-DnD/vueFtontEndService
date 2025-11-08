<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    },
    mainIcon: {
        required: true
    },
})
</script>

<template>
    <h1
        class="mx-auto w-full p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer select-none font-gothic flex gap-2 items-center justify-center">
        <mainIcon class="w-8 h-8" />
        {{ text }}
    </h1>
</template>