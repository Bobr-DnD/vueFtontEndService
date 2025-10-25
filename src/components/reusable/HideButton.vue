<script setup>
import { ref } from 'vue';
import { ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'

const hidden = defineModel('hidden', {type: Boolean, reuired: true})

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
    }
})

const effects_text = ref(props.textShow)

</script>

<template>
    <button @click="hidden = !hidden; hidden ? effects_text = textHide : effects_text = textShow"
        class="px-4 py-2 rounded-xl font-univers font-semibold text-xl transition-all duration-500 ease-in-out grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
        :class="hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

        <mainIcon v-if="props.mainIcon" class="w-8 h-8" />
        {{ effects_text }}
        <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
            :class="hidden ? 'rotate-180' : 'rotate-0'" />
    </button>
</template>