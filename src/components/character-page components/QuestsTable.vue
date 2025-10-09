<script setup>
import { ref } from 'vue';
import { FlagIcon, ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    quest: {type: Object, required: true}
})

let quest_text = ref('Показати особистий квест')
let quest_hidden = ref(true)

</script>

<template>
    <h2 @click="
        quest_hidden = !quest_hidden;
    quest_text === 'Показати особистий квест'
        ? quest_text = 'Приховати особистий квест'
        : quest_text = 'Показати особистий квест'" class="px-4 py-2 text-center text-xl font-univers font-semibold mb-2 rounded-lg hover:cursor-pointer transition-all duration-500 
            ease-in-out select-none grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
        :class="quest_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

        <FlagIcon class="w-8 h-8" />
        {{ quest_text }}
        <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
            :class="quest_hidden ? 'rotate-180' : 'rotate-0'" />
    </h2>

    <div v-if="!quest_hidden" class="border-2 rounded-lg border-darkred-dark_gray p-1">

        <div class="w-full text-center text-2xl font-semibold font-gothic">
            {{ props.quest.name }}
        </div>

        <div v-for="step in props.quest.steps" class="text-md font-univers font-medium">

            <div v-if="step.status === 'fail'">
                • <span class="line-through decoration-2 decoration-darkred-red">{{ step.name }}</span>
            </div>

            <div v-if="step.status === 'done'">
                • <span class="line-through decoration-2 decoration-darkred-dark">{{ step.name }}</span>
            </div>

            <div v-if="step.status === 'active'" class="">
                • {{ step.name }}
            </div>

        </div>

    </div>
</template>