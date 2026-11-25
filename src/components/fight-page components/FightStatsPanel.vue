<script setup>
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue'

const props = defineProps({
    isAdmin: { type: Boolean, default: false },
    selectedEnemy: { type: Object, default: null }, // GM mode: the enemy picked in the top bar
    character: { type: Object, default: null },      // player mode: their own character
    perks: { type: Array, default: () => [] },        // session.perks catalog, to resolve enemy.perks ids
    entities: { type: Array, default: () => [] }      // session.entities catalog, to resolve enemy.entities ids
})

const emit = defineEmits(['update-enemy-health'])

function perkName(id) {
    return props.perks.find(p => p.id === id)?.name ?? '?'
}

function entityName(id) {
    return props.entities.find(e => e.id === id)?.name ?? '?'
}

function onHealthInput(healthId, value) {
    const num = Number(value)
    if (Number.isNaN(num)) return
    emit('update-enemy-health', { healthId, value: num })
}
</script>

<template>
    <div class="h-full p-3 bg-brand-base text-brand-text font-gothic rounded-xl border-2 border-brand-surface overflow-y-auto auto-hide-scroll">

        <template v-if="isAdmin">
            <template v-if="selectedEnemy">
                <div class="flex items-center gap-3 mb-2">
                    <img v-if="selectedEnemy.image" :src="selectedEnemy.image" :alt="selectedEnemy.name"
                        class="w-10 h-10 rounded-full object-cover" />
                    <span class="text-lg font-semibold">{{ selectedEnemy.name }}</span>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div class="space-y-2">
                        <div v-for="h in selectedEnemy.health" :key="h.id" class="space-y-1">
                            <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
                            <input type="number" :value="h.value" @change="onHealthInput(h.id, $event.target.value)"
                                class="w-full p-1 rounded bg-brand-surface text-brand-text border border-brand-subtle text-sm" />
                        </div>
                        <div v-if="!selectedEnemy.health?.length" class="text-sm text-brand-faint">Немає полів здоров'я</div>
                    </div>

                    <div class="space-y-1">
                        <div class="text-sm font-semibold text-brand-faint">Характеристики</div>
                        <div v-for="(v, k) in selectedEnemy.stats" :key="k" class="text-sm">{{ k }}: {{ v }}</div>
                        <div v-if="!selectedEnemy.stats || !Object.keys(selectedEnemy.stats).length" class="text-sm text-brand-faint">—</div>

                        <div class="text-sm font-semibold text-brand-faint mt-2">Перки / предмети</div>
                        <div class="text-sm" v-if="selectedEnemy.perks?.length || selectedEnemy.entities?.length">
                            <span v-for="id in selectedEnemy.perks" :key="id" class="inline-block px-1.5 py-0.5 mr-1 mb-1 bg-brand-surface rounded">{{ perkName(id) }}</span>
                            <span v-for="id in selectedEnemy.entities" :key="id" class="inline-block px-1.5 py-0.5 mr-1 mb-1 bg-brand-surface rounded">{{ entityName(id) }}</span>
                        </div>
                        <div v-else class="text-sm text-brand-faint">—</div>
                    </div>

                    <div>
                        <div class="text-sm font-semibold text-brand-faint mb-1">Нотатки</div>
                        <div class="text-sm whitespace-pre-wrap">{{ selectedEnemy.notes || '—' }}</div>
                    </div>
                </div>
            </template>

            <div v-else class="h-full flex items-center justify-center text-brand-faint">
                Оберіть ворога зверху, щоб побачити та редагувати його стати
            </div>
        </template>

        <template v-else-if="character">
            <div class="flex items-center gap-3 mb-2">
                <img v-if="character.image" :src="character.image" :alt="character.name" class="w-10 h-10 rounded-full object-cover" />
                <span class="text-lg font-semibold">{{ character.name }}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="space-y-2">
                    <ProgressiveBar v-for="h in character.health" :key="h.id" :value="h.value" :valueMax="h.max"
                        :text="h.name" :colors="h.colors" />
                </div>

                <div class="space-y-1">
                    <div class="text-sm font-semibold text-brand-faint">Характеристики</div>
                    <div v-for="c in character.characteristics" :key="c.id" class="text-sm">{{ c.name }}: {{ c.value }}</div>
                </div>

                <div class="space-y-1">
                    <div class="text-sm font-semibold text-brand-faint">Профілі спорядження</div>
                    <div v-for="l in character.loadouts" :key="l.id" class="text-sm">{{ l.name }}</div>
                    <div v-if="!character.loadouts?.length" class="text-sm text-brand-faint">Профілів немає</div>
                </div>
            </div>
        </template>

        <div v-else class="h-full flex items-center justify-center text-brand-faint">Немає даних</div>
    </div>
</template>
