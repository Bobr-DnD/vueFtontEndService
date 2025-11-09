<script setup>
import { ChevronDoubleUpIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    mainIcon: {
        required: true
    },
    hidden: {
        type: Boolean, required: true
    }
})
</script>

<template>
    <h1
        class="mx-auto w-min my- p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer select-none font-gothic grid grid-cols-[40px_1fr_60px] items-center justify-items-center">
        <mainIcon class="w-8 h-8" />
        {{ text }}
        <ChevronDoubleUpIcon :class="hidden ? 'rotate-180' : 'rotate-0'"
            class="w-8 h-8 transition-transform duration-300" />
    </h1>
</template>