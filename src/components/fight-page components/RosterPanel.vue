<script setup>
const props = defineProps({
    participants: { type: Array, default: () => [] },
    characters: { type: Array, default: () => [] },
    enemies: { type: Array, default: () => [] }
})

const emit = defineEmits(['resolve', 'set-ap'])

function characterName(id) {
    return props.characters.find(c => c.id === id)?.name ?? '?'
}

function enemyName(id) {
    return props.enemies.find(e => e.id === id)?.name ?? '?'
}

function setAP(characterId, field, rawValue) {
    const value = Number(rawValue)
    if (Number.isNaN(value)) return
    emit('set-ap', { characterId, [field]: value })
}
</script>

<template>
    <div class="flex flex-col gap-2 p-2 bg-darkred-dark text-darkred-light font-gothic rounded-xl border-2 border-darkred-dark_gray h-full overflow-y-auto auto-hide-scroll">
        <div class="font-semibold text-center border-b-2 border-darkred-red pb-1 shrink-0">Учасники</div>

        <div v-for="p in participants" :key="p.character" class="p-2 rounded-lg bg-darkred-dark_gray/60 space-y-1">
            <div class="flex items-center justify-between">
                <span class="font-medium">{{ characterName(p.character) }}</span>
                <span :class="p.ready ? 'text-orange-gold' : 'text-darkred-light_gray'" class="text-xs">
                    {{ p.ready ? 'Готовий' : 'Очікує' }}
                </span>
            </div>

            <div class="flex items-center gap-2 text-xs">
                <span>ОД:</span>
                <input type="number" :value="p.actionPoints.current"
                    @change="setAP(p.character, 'current', $event.target.value)"
                    class="w-14 p-1 rounded bg-darkred-dark text-darkred-light border border-darkred-light_gray" />
                <span>/</span>
                <input type="number" :value="p.actionPoints.max"
                    @change="setAP(p.character, 'max', $event.target.value)"
                    class="w-14 p-1 rounded bg-darkred-dark text-darkred-light border border-darkred-light_gray" />
            </div>

            <div v-if="p.ready && p.pendingAction" class="mt-1 p-2 rounded bg-darkred-dark border border-darkred-red space-y-1">
                <div class="text-xs">Ціль: {{ enemyName(p.pendingAction.targetEnemy) }}</div>
                <div class="text-xs">Результат: <span class="font-bold">{{ p.pendingAction.total }}</span></div>
                <div class="flex gap-2">
                    <button @click="emit('resolve', { characterId: p.character, approve: true })"
                        class="flex-1 p-1.5 rounded bg-greenish-dark text-xs md:hover:cursor-pointer">Підтвердити</button>
                    <button @click="emit('resolve', { characterId: p.character, approve: false })"
                        class="flex-1 p-1.5 rounded bg-darkred-red text-xs md:hover:cursor-pointer">Відхилити</button>
                </div>
            </div>
        </div>

        <div v-if="!participants.length" class="text-darkred-light_gray text-sm text-center py-2">Ще немає учасників</div>
    </div>
</template>
