<script setup>
import { ref } from 'vue';
import { SparklesIcon, ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'


const props = defineProps({
    effects: { type: Object, required: true }
})

let effects_hidden = ref(true)
let effects_text = ref('Показати ефекти')

</script>

<template>
    <button @click="effects_hidden = !effects_hidden; effects_text === 'Показати ефекти'
        ? (effects_text = 'Приховати ефекти')
        : (effects_text = 'Показати ефекти')"
        class="px-4 py-2 rounded-xl font-univers font-semibold text-xl transition-all duration-500 ease-in-out grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
        :class="effects_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

        <SparklesIcon class="w-8 h-8" />
        {{ effects_text }}
        <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
            :class="effects_hidden ? 'rotate-180' : 'rotate-0'" />
    </button>


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
                {{ effect.deathTime }}
            </div>
        </div>
    </div>
</template>