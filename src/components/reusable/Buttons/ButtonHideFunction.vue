<script setup>
import { ChevronDoubleUpIcon } from '@heroicons/vue/24/solid';
import { returnIcon } from '@utils/icons';

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

const icon = returnIcon(props.mainIcon)

</script>

<template>
    <button class="mx-auto p-2 bg-brand-accent/75 text-center text-3xl font-bold text-brand-text
            rounded-xl font-gothic grid grid-cols-[40px_1fr_60px] items-center justify-items-center">
        <!-- <mainIcon class="w-8 h-8" /> -->
        <component :is="icon.icon" class="w-8 h-8" />
        {{ text }}
        <ChevronDoubleUpIcon :class="hidden ? 'rotate-180' : 'rotate-0'"
            class="w-8 h-8 transition-transform duration-300" />
    </button>
</template>