<script setup>
import { ref } from 'vue';
import { checkArrayFieldExisting, addRow, removeRow } from '@utils/entityHelper';

import Header1 from '../reusable/Titles/Header1.vue';
import EffectsTable from '../character-page components/EffectsTable.vue';
import PlusButton from '../reusable/Buttons/PlusButton.vue';
import EffectsModal from '../character-page components/EntityModals/EffectsModal.vue';

const modal_hidden = ref(true)

const props = defineProps({
    character_effects: {
        type: Array,
        required: true
    },
    sessionEffects: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

function addEffect(effectId) {
    addRow(props.sessionEffects, props.character_effects, effectId)
    props.callback(props.character_effects)
}

function removeEffect(effectId) {
    removeRow(props.character_effects, effectId)
    props.callback(props.character_effects)
}

</script>

<template>
    <div class="flex flex-col items-center gap-2">
        <EffectsTable v-if="checkArrayFieldExisting(props.character_effects)" class="w-full"
            :effects="props.character_effects" :removable="true" :callback="removeEffect"/>

        <Header1 v-if="!checkArrayFieldExisting(props.character_effects)" label="Пусто" />

        <PlusButton @click="modal_hidden = false"
            class="w-16 h-16 border-4 rounded-lg border-darkred-dark justify-self-center md:hover:bg-darkred-gray group" />

        <EffectsModal v-if="!modal_hidden" :effects="props.sessionEffects" :callback="addEffect"
            :callback_close="() => modal_hidden = true" />
    </div>
</template>