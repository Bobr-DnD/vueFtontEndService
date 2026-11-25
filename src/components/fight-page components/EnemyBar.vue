<script setup>
const props = defineProps({
    enemies: { type: Array, default: () => [] },
    participants: { type: Array, default: () => [] }, // fight.participants
    allCharacters: { type: Array, default: () => [] }, // sessionStore.session.characters, to resolve name/image/health
    isAdmin: { type: Boolean, default: false },
    selectedEnemyId: { type: String, default: null }
})

const emit = defineEmits(['select'])

function healthRatio(h) {
    return h.max ? Math.max(0, Math.min(1, h.value / h.max)) : 0
}

function healthColor(h) {
    const ratio = healthRatio(h)
    if (ratio > 0.5) return '#3E5F44'
    if (ratio > 0.25) return '#FABC3F'
    return '#8E1616'
}

function characterOf(participant) {
    return props.allCharacters.find(c => c.id === participant.character)
}
</script>

<template>
    <div class="flex items-stretch gap-2 p-2 bg-brand-base border-b-2 border-brand-accent font-gothic">

        <div class="flex-1 min-w-0 flex gap-2 overflow-x-auto auto-hide-scroll">

            <!-- Enemies are admin-selectable (drives the stats panel below);
                 characters are informational only, no click handler. -->
            <div v-for="enemy in enemies" :key="enemy.id" @click="isAdmin && emit('select', enemy.id)"
                :class="[selectedEnemyId === enemy.id ? 'border-brand-accent-hover' : 'border-brand-surface', isAdmin && 'md:hover:cursor-pointer']"
                class="shrink-0 w-56 p-2 rounded-xl border-2 bg-brand-surface text-brand-text">

                <div class="flex items-center gap-2 mb-1">
                    <img v-if="enemy.image" :src="enemy.image" :alt="enemy.name" class="w-8 h-8 rounded-full object-cover" />
                    <span class="font-semibold truncate">{{ enemy.name }}</span>
                </div>

                <div v-for="h in enemy.health" :key="h.id" class="text-xs mb-1">
                    <div class="flex justify-between"><span>{{ h.name }}</span><span>{{ h.value }}/{{ h.max }}</span></div>
                    <div class="w-full h-2 bg-gray-300 rounded overflow-hidden">
                        <div class="h-full transition-all duration-300"
                            :style="{ width: `${healthRatio(h) * 100}%`, backgroundColor: healthColor(h) }"></div>
                    </div>
                </div>
            </div>

            <div v-for="participant in participants" :key="participant.character"
                class="shrink-0 w-56 p-2 rounded-xl border-2 border-brand-surface bg-brand-surface/60 text-brand-text">

                <div class="flex items-center gap-2 mb-1">
                    <img v-if="characterOf(participant)?.image" :src="characterOf(participant).image"
                        :alt="characterOf(participant)?.name" class="w-8 h-8 rounded-full object-cover" />
                    <span class="font-semibold truncate">{{ characterOf(participant)?.name ?? '?' }}</span>
                </div>

                <div v-for="h in characterOf(participant)?.health ?? []" :key="h.id" class="text-xs mb-1">
                    <div class="flex justify-between"><span>{{ h.name }}</span><span>{{ h.value }}/{{ h.max }}</span></div>
                    <div class="w-full h-2 bg-gray-300 rounded overflow-hidden">
                        <div class="h-full transition-all duration-300"
                            :style="{ width: `${healthRatio(h) * 100}%`, backgroundColor: healthColor(h) }"></div>
                    </div>
                </div>
            </div>

            <div v-if="!enemies.length && !participants.length" class="text-brand-faint text-sm p-2 self-center">Ще нікого немає</div>
        </div>

        <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0 pl-2 border-l-2 border-brand-surface">
            <slot name="actions" />
        </div>
    </div>
</template>
