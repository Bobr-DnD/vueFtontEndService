<script setup>
import { ref } from 'vue';
import HideButton from '../reusable/HideButton.vue';
import { SparklesIcon, ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'


const props = defineProps({
    effects: { type: Object, required: true }
})

let effects_hidden = ref(true)

</script>

<template>
    <HideButton textShow="Показати ефекти" textHide="Приховати ефекти" v-model:hidden="effects_hidden" :mainIcon="SparklesIcon"/>

    <div v-if="!effects_hidden" class="space-y-2 font-univers">

        <div class="grid grid-cols-[1fr_1fr_min-content] p-2 gap-2 justify-items-center items-center bg-darkred-dark_gray  
                border-darkred-gray rounded-xl shadow-sm text-darkred-light">
            <div>
                Назва
            </div>
            <div>
                Ефект
            </div>
            <div class="justify-self-end">
                Тривалість
            </div>
        </div>

        <div v-for="effect in props.effects" class="grid grid-cols-[1fr_1fr_80px] gap-2 p-3 justify-items-center items-center
         bg-darkred-dark_gray  border-darkred-gray rounded-xl shadow-sm text-darkred-light">

            <div class="text-lg font-semibold">
                {{ effect.effect.name }}
            </div>

            <div class="text-sm">
                {{ effect.effect.description }}
            </div>

            <div class="text-md font-medium px-2 py-1 rounded-lg bg-darkred-dark">
                {{ effect.timeLeft }}
            </div>
        </div>
    </div>
</template>