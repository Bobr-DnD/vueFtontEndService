<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import RepositoryFactory from '@http/RepositoryFactory'
import { asyncHandler } from '@utils/asyncHandler'

const props = defineProps({
    sessionId: { type: String, required: true }
})

// GET /logs always scopes to the admin's own session server-side and only
// takes a single exact `event` match (not a prefix) - so rather than firing
// one request per fight event name, fetch the latest page and filter client-side.
const RELEVANT_EVENTS = new Set([
    'fight:move', 'fight:readyAttack', 'fight:resolveAttack', 'fight:newRound', 'character:rollDice'
])
const REFRESH_MS = 4000

const logs = ref([])
let intervalId = null

async function fetchLogs() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.getLogs({ page: 1, limit: 100, sessionId: props.sessionId })
    )
    if (err) return
    logs.value = res.data.logs.filter(log => RELEVANT_EVENTS.has(log.event))
}

function formatTime(isoDate) {
    return new Date(isoDate).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
    fetchLogs()
    intervalId = setInterval(fetchLogs, REFRESH_MS)
})

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
})

defineExpose({ fetchLogs })
</script>

<template>
    <div class="h-full flex flex-col bg-darkred-dark text-darkred-light font-gothic rounded-xl border-2 border-darkred-dark_gray overflow-hidden">
        <div class="p-2 border-b-2 border-darkred-red font-semibold text-center shrink-0">Журнал бою</div>

        <div class="flex-1 overflow-y-auto auto-hide-scroll p-2 space-y-1.5 text-sm">
            <div v-for="log in logs" :key="log.id" class="p-1.5 rounded bg-darkred-dark_gray/50">
                <div class="text-[10px] text-darkred-light_gray">{{ formatTime(log.createdAt) }} · {{ log.characterName || '—' }}</div>
                <div>{{ log.message || log.event }}</div>
            </div>

            <div v-if="!logs.length" class="text-darkred-light_gray text-center py-4">Поки немає подій</div>
        </div>
    </div>
</template>
