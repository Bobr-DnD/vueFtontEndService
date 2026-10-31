<script setup>
import { ref, computed, watch } from 'vue'
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue'
import { parseDiceNotation } from '@utils/tileGraph'

const props = defineProps({
    character: { type: Object, required: true }, // sessionStore character (health, loadouts, entities)
    participant: { type: Object, required: true }, // fight participant subdoc for this character
    fight: { type: Object, required: true },
    allEntities: { type: Array, default: () => [] } // session.entities catalog, to resolve weapon names/characteristics
})

const emit = defineEmits(['set-active-loadout', 'set-active-weapon', 'ready-attack', 'cancel-ready'])

const DICE_SIDES = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']

const activeLoadout = computed(() => props.character.loadouts?.find(l => l.id === props.participant.activeLoadout) ?? null)

const weaponOptions = computed(() => {
    const ids = activeLoadout.value?.itemsIds ?? []
    return props.allEntities.filter(e => ids.includes(e.id))
})

const activeWeapon = computed(() => props.allEntities.find(e => e.id === props.participant.activeWeapon) ?? null)

const attackCostPreview = computed(() => {
    const cfg = props.fight.attackCost
    if (cfg.source === 'activeWeapon' && cfg.fieldName && activeWeapon.value?.characteristics) {
        const value = Number(activeWeapon.value.characteristics[cfg.fieldName])
        if (!Number.isNaN(value)) return value
    }
    return cfg.fixedAmount ?? 0
})

// Ready-attack form state
const targetEnemyId = ref('')
const targetHealthId = ref('')
const rollMode = ref('virtual')
const diceCounts = ref(Object.fromEntries(DICE_SIDES.map(d => [d, 0])))
const modifier = ref(0)
const manualTotal = ref(0)

const targetEnemy = computed(() => props.fight.enemies.find(e => e.id === targetEnemyId.value) ?? null)

watch(targetEnemy, (enemy) => {
    targetHealthId.value = enemy?.health?.[0]?.id ?? ''
})

// Prefills the dice config from the weapon's damage-dice characteristic -
// the player can still edit it before readying.
watch(activeWeapon, (weapon) => {
    const fieldName = props.fight.weaponDamageFieldName
    const raw = weapon?.characteristics?.[fieldName]

    diceCounts.value = Object.fromEntries(DICE_SIDES.map(d => [d, 0]))
    modifier.value = 0

    if (typeof raw === 'string') {
        const parsed = parseDiceNotation(raw)
        parsed.dice.forEach(d => { if (d.die in diceCounts.value) diceCounts.value[d.die] = d.count })
        modifier.value = parsed.modifier
    }
}, { immediate: true })

const diceConfig = computed(() => Object.entries(diceCounts.value)
    .filter(([, count]) => count > 0)
    .map(([die, count]) => ({ die, count })))

function selectLoadout(value) {
    emit('set-active-loadout', value || null)
}

function selectWeapon(value) {
    emit('set-active-weapon', value || null)
}

function submitReady() {
    if (!targetEnemyId.value || !targetHealthId.value) return

    emit('ready-attack', {
        targetEnemy: targetEnemyId.value,
        targetHealthId: targetHealthId.value,
        rollMode: rollMode.value,
        dice: rollMode.value === 'virtual' ? diceConfig.value : [],
        modifier: Number(modifier.value) || 0,
        manualTotal: rollMode.value === 'manual' ? Number(manualTotal.value) || 0 : undefined
    })
}
</script>

<template>
    <div class="p-3 bg-darkred-dark text-darkred-light font-gothic rounded-xl border-2 border-darkred-dark_gray grid grid-cols-1 lg:grid-cols-3 gap-3">

        <div class="space-y-2">
            <div v-for="h in character.health" :key="h.id">
                <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
            </div>
            <ProgressiveBar :value="participant.actionPoints.current" :valueMax="participant.actionPoints.max"
                text="Очки дій" :colors="['#5E936C', '#FABC3F', '#8E1616']" />
        </div>

        <div class="space-y-2">
            <div>
                <label class="text-sm">Профіль спорядження</label>
                <select :value="participant.activeLoadout ?? ''" @change="selectLoadout($event.target.value)"
                    class="w-full p-2 rounded-lg bg-darkred-dark_gray border-2 border-darkred-dark_gray">
                    <option value="">—</option>
                    <option v-for="l in character.loadouts" :key="l.id" :value="l.id">{{ l.name }}</option>
                </select>
            </div>
            <div>
                <label class="text-sm">Активна зброя</label>
                <select :value="participant.activeWeapon ?? ''" @change="selectWeapon($event.target.value)"
                    class="w-full p-2 rounded-lg bg-darkred-dark_gray border-2 border-darkred-dark_gray">
                    <option value="">—</option>
                    <option v-for="w in weaponOptions" :key="w.id" :value="w.id">{{ w.name }}</option>
                </select>
            </div>
            <div class="text-xs text-darkred-light_gray">Вартість атаки: {{ attackCostPreview }} ОД</div>
        </div>

        <div class="space-y-2">
            <div v-if="participant.ready" class="p-2 rounded-lg bg-darkred-dark_gray text-center space-y-2">
                <div>Атака готова, очікує підтвердження адміна…</div>
                <div v-if="participant.pendingAction" class="text-2xl font-bold">{{ participant.pendingAction.total }}</div>
                <button @click="emit('cancel-ready')" class="w-full p-2 rounded-lg bg-darkred-red text-sm md:hover:cursor-pointer">Скасувати</button>
            </div>

            <template v-else>
                <select v-model="targetEnemyId" class="w-full p-2 rounded-lg bg-darkred-dark_gray border-2 border-darkred-dark_gray">
                    <option value="">Ціль…</option>
                    <option v-for="e in fight.enemies" :key="e.id" :value="e.id">{{ e.name }}</option>
                </select>

                <select v-if="targetEnemy" v-model="targetHealthId"
                    class="w-full p-2 rounded-lg bg-darkred-dark_gray border-2 border-darkred-dark_gray">
                    <option v-for="h in targetEnemy.health" :key="h.id" :value="h.id">{{ h.name }}</option>
                </select>

                <div class="flex gap-2 text-xs">
                    <button @click="rollMode = 'virtual'"
                        :class="rollMode === 'virtual' ? 'bg-darkred-gray' : 'bg-darkred-dark_gray'"
                        class="flex-1 p-1.5 rounded md:hover:cursor-pointer">Кубики</button>
                    <button @click="rollMode = 'manual'"
                        :class="rollMode === 'manual' ? 'bg-darkred-gray' : 'bg-darkred-dark_gray'"
                        class="flex-1 p-1.5 rounded md:hover:cursor-pointer">Свій результат</button>
                </div>

                <div v-if="rollMode === 'virtual'" class="grid grid-cols-4 gap-1 text-xs">
                    <div v-for="die in DICE_SIDES" :key="die" class="flex flex-col items-center">
                        <span>{{ die }}</span>
                        <input type="number" min="0" v-model.number="diceCounts[die]"
                            class="w-full p-1 rounded bg-darkred-dark_gray text-center" />
                    </div>
                    <div class="col-span-4 flex items-center gap-2">
                        <span class="text-xs">Модифікатор</span>
                        <input type="number" v-model.number="modifier" class="w-full p-1 rounded bg-darkred-dark_gray text-center" />
                    </div>
                </div>

                <div v-else>
                    <label class="text-xs">Результат кидка</label>
                    <input type="number" v-model.number="manualTotal" class="w-full p-2 rounded-lg bg-darkred-dark_gray" />
                </div>

                <button @click="submitReady" :disabled="!targetEnemyId || !targetHealthId"
                    class="w-full p-2 rounded-lg bg-greenish-dark disabled:opacity-50 md:hover:cursor-pointer">Готово</button>
            </template>
        </div>
    </div>
</template>
