<script setup>
import { ref } from 'vue';
import { ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'
import HideTittle from './HideTittle.vue';

const props = defineProps({
    textShow : {
        type: String,
        required: false,
        default: 'Приховати'
    },
    textHide : {
        type: String,
        required: false,
        default: 'Показати'
    },
    mainIcon:{
        required: false
    },
    hidden: {type: Boolean, required: true}
})

const text = ref(props.textShow)
if (props.hidden) text.value = props.textHide
else text.value = props.textShow
</script>

<template>
    <button
        class="px-4 py-2 rounded-xl font-univers font-semibold text-xl transition-all duration-500 ease-in-out grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
        :class="props.hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

        <mainIcon v-if="props.mainIcon" class="w-8 h-8" />
        {{ text }}
        <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
            :class="props.hidden ? 'rotate-180' : 'rotate-0'" />

            <h1>{{ hidden }}</h1>
    </button>
</template>