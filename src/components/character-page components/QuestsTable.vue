<script setup>
import { ref } from 'vue';
import HideButton from '../reusable/HideButton.vue';
import { FlagIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    quest: {type: Object, required: true}
})

let quest_hidden = ref(true)

</script>

<template>
    <HideButton textShow="Показати особистий квест" textHide="Приховати особистий квест" v-model:hidden="quest_hidden" :mainIcon="FlagIcon"/>

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