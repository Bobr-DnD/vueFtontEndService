<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { socket } from '@ws/webSocket';

import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue';
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';

const emit = defineEmits(['close'])

const DICE = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
const MAX_PER_DIE = 20
const STORAGE_KEY = 'diceRoller:config'

function defaultDice() {
    return DICE.map(die => ({ die, count: 0 }))
}

function loadConfig() {
    try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
        if (saved && Array.isArray(saved.dice)) {
            const countByDie = new Map(saved.dice.map(d => [d.die, d.count]))
            return {
                dice: DICE.map(die => ({
                    die,
                    count: Math.max(0, Math.min(MAX_PER_DIE, Math.round(countByDie.get(die)) || 0))
                })),
                modifier: Math.round(saved.modifier) || 0
            }
        }
    } catch {
        // sessionStorage unavailable or corrupted - fall back to defaults
    }
    return { dice: defaultDice(), modifier: 0 }
}

function persistConfig() {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            dice: dice.map(d => ({ die: d.die, count: d.count })),
            modifier: modifier.value
        }))
    } catch {
        // sessionStorage unavailable (private mode, etc.) - config stays in-memory only
    }
}

const initial = loadConfig()
const dice = reactive(initial.dice)
const modifier = ref(initial.modifier)
const result = ref(null)

watch([dice, modifier], persistConfig, { deep: true })

const activeDice = computed(() => dice.filter(d => d.count > 0))

const formula = computed(() => {
    if (!activeDice.value.length) return ''
    const mod = Math.round(modifier.value) || 0
    const diceText = activeDice.value.map(d => `${d.count}${d.die}`).join(' + ')
    return mod ? `${diceText} ${mod > 0 ? '+' : '-'} ${Math.abs(mod)}` : diceText
})

function increment(entry) {
    entry.count = Math.min(MAX_PER_DIE, entry.count + 1)
}

function decrement(entry) {
    entry.count = Math.max(0, entry.count - 1)
}

function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
}

function roll() {
    if (!activeDice.value.length) return

    const groups = activeDice.value.map(d => ({
        die: d.die,
        rolls: Array.from({ length: d.count }, () => rollDie(Number(d.die.slice(1))))
    }))

    const diceTotal = groups.reduce((sum, g) => sum + g.rolls.reduce((s, r) => s + r, 0), 0)
    const mod = Math.round(modifier.value) || 0
    modifier.value = mod
    const total = diceTotal + mod

    result.value = { groups, total }
    persistConfig()

    const notation = groups.map(g => `${g.rolls.length}${g.die}`).join('+')
    const rollsText = groups.map(g => `${g.die}: [${g.rolls.join(', ')}]`).join('; ')
    const modText = mod ? ` ${mod > 0 ? '+' : '-'} ${Math.abs(mod)}` : ''

    socket.emit('character:rollDice', {
        message: `Персонаж кинув ${notation}: ${rollsText}${modText} = ${total}`
    })
}
</script>

<template>
    <div @click="emit('close')"
        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">

        <div @click.stop
            class="max-w-[420px] w-full mx-2 p-4 grid grid-cols-1 gap-3 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl relative font-gothic md:hover:cursor-default">

            <CloseButtonRedBG @click="emit('close')" />

            <h2 class="text-xl text-center">🎲 Кидок кубиків</h2>

            <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <div v-for="entry in dice" :key="entry.die"
                    class="dice-row flex items-center justify-center gap-1 sm:gap-2 basis-full sm:basis-1">
                    <span class="w-10 sm:w-14 text-sm sm:text-base font-semibold">{{ entry.die }}</span>

                    <button @click="decrement(entry)"
                        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-darkred-light_gray md:hover:bg-darkred-gray/60 md:hover:cursor-pointer">
                        −
                    </button>

                    <span class="w-6 text-center tabular-nums">{{ entry.count }}</span>

                    <button @click="increment(entry)"
                        class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-darkred-light_gray md:hover:bg-darkred-gray/60 md:hover:cursor-pointer">
                        +
                    </button>
                </div>
            </div>

            <label class="flex items-center gap-2 text-sm">
                Модифікатор
                <input v-model.number="modifier" type="number"
                    class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray" />
            </label>

            <div v-if="formula" class="text-center text-sm text-darkred-light_gray">
                {{ formula }}
            </div>

            <AprroveButtonWithText text="Кинути" class="w-full h-12 flex justify-center items-center"
                :class="!activeDice.length && 'opacity-50 pointer-events-none'" @click="roll" />

            <div v-if="result" class="text-center space-y-1">
                <div v-for="g in result.groups" :key="g.die" class="text-sm text-darkred-light_gray">
                    {{ g.die }}: [{{ g.rolls.join(', ') }}]
                </div>
                <div class="text-3xl font-bold">{{ result.total }}</div>
            </div>

        </div>

    </div>
</template>

<style scoped>
/* Overrides the sm:basis-[...] two-column width at every breakpoint, so the
   last (odd, 7th) die row always spans the full row instead of leaving the
   second column empty - without a per-item class computed in the template. */
.dice-row:last-child {
    flex-basis: 100%;
}
</style>
