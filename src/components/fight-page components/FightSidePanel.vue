<script setup>
import { ref } from 'vue'
import FightLog from './FightLog.vue'
import RosterPanel from './RosterPanel.vue'

const props = defineProps({
    sessionId: { type: String, required: true },
    isGM: { type: Boolean, default: false },
    participants: { type: Array, default: () => [] },
    characters: { type: Array, default: () => [] },
    enemies: { type: Array, default: () => [] }
})

defineEmits(['resolve', 'set-ap'])

// Players only ever see the log (matches the sketch: one "fight logs" box
// filling the column). GM mode also needs the ready/approve roster, so it
// gets a slim tab strip switching between the two within the same slot,
// rather than permanently splitting the column into two stacked boxes.
const tab = ref('log')
</script>

<template>
    <div class="flex flex-col gap-2 h-full min-h-0">
        <div v-if="isGM" class="flex gap-1 shrink-0 font-gothic text-sm">
            <button @click="tab = 'log'"
                :class="tab === 'log' ? 'bg-darkred-dark text-darkred-bright' : 'bg-darkred-dark_gray text-darkred-light'"
                class="flex-1 p-1.5 rounded-lg md:hover:cursor-pointer">Журнал</button>
            <button @click="tab = 'roster'"
                :class="tab === 'roster' ? 'bg-darkred-dark text-darkred-bright' : 'bg-darkred-dark_gray text-darkred-light'"
                class="flex-1 p-1.5 rounded-lg md:hover:cursor-pointer">Учасники</button>
        </div>

        <FightLog v-if="!isGM || tab === 'log'" :sessionId="sessionId" class="flex-1 min-h-0" />
        <RosterPanel v-else :participants="participants" :characters="characters" :enemies="enemies"
            @resolve="$emit('resolve', $event)" @set-ap="$emit('set-ap', $event)" class="flex-1 min-h-0" />
    </div>
</template>
