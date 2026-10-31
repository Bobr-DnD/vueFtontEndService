<script setup>
defineProps({
    enemies: { type: Array, default: () => [] },
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
</script>

<template>
    <div class="flex items-stretch gap-2 p-2 bg-darkred-dark border-b-2 border-darkred-red font-gothic">

        <div class="flex-1 min-w-0 flex gap-2 overflow-x-auto auto-hide-scroll">
            <div v-for="enemy in enemies" :key="enemy.id" @click="emit('select', enemy.id)"
                :class="selectedEnemyId === enemy.id ? 'border-darkred-bright' : 'border-darkred-dark_gray'"
                class="shrink-0 w-56 p-2 rounded-xl border-2 bg-darkred-dark_gray text-darkred-light md:hover:cursor-pointer">

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

                <div v-if="isAdmin && enemy.notes" class="text-xs italic text-darkred-light_gray mt-1 truncate" :title="enemy.notes">
                    📝 {{ enemy.notes }}
                </div>

                <div v-if="isAdmin && enemy.stats && Object.keys(enemy.stats).length"
                    class="text-xs text-darkred-light_gray mt-1 flex flex-wrap gap-1">
                    <span v-for="(v, k) in enemy.stats" :key="k" class="px-1.5 py-0.5 bg-darkred-dark rounded">{{ k }}: {{ v }}</span>
                </div>
            </div>

            <div v-if="!enemies.length" class="text-darkred-light_gray text-sm p-2 self-center">Ворогів немає</div>
        </div>

        <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0 pl-2 border-l-2 border-darkred-dark_gray">
            <slot name="actions" />
        </div>
    </div>
</template>
