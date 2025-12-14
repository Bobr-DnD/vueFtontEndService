<script setup>
import { ref } from 'vue';
import { checkArrayFieldExisting, addRow, removeRow } from '@utils/entityHelper';

import Header1 from '../reusable/Titles/Header1.vue';
import QuestsTable from '../character-page components/QuestsTable.vue';
import PlusButton from '../reusable/Buttons/PlusButton.vue';
import QuestsModal from '../character-page components/EntityModals/QuestsModal.vue';

const props = defineProps({
    character_quests: {
        type: Array,
        required: true
    },
    session_quests: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const modal_hidden = ref(true)

function addQuest(questId) {
    addRow(props.session_quests, props.character_quests, questId)
    props.callback(props.character_quests)
}

function removeQuest(questId) {
    removeRow(props.character_quests, questId)
    props.callback(props.character_quests)
}

</script>

<template>
    <div class="flex flex-col items-center gap-2">
        <QuestsTable v-if="checkArrayFieldExisting(props.character_quests)" class="w-full"
            :quests="props.character_quests" :removable="true" :callback="removeQuest" />

        <Header1 v-if="!checkArrayFieldExisting(props.character_quests)" label="Пусто" />

        <PlusButton @click="modal_hidden = false"
            class="w-16 h-16 border-4 rounded-lg border-darkred-dark justify-self-center md:hover:bg-darkred-gray group" />

        <QuestsModal v-if="!modal_hidden" :quests="props.session_quests" :callback="addQuest"
            :callback_close="() => modal_hidden = true" />
    </div>
</template>