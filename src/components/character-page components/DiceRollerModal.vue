<script setup>
import { reactive, ref, computed, watch, onBeforeUnmount } from 'vue';
import { socket } from '@ws/webSocket';

import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue';
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';

const emit = defineEmits(['close'])

const DICE = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
const MAX_PER_DIE = 20
const STORAGE_KEY = 'diceRoller:config'

// d6 keeps the plain square tile; the rest get an inline SVG outline closer
// to their real polyhedron (viewBox is 0 0 100 100). d100 is a wider kite
// than d10 - it's conventionally rolled/shown as a percentile d10, but needs
// to read as visually distinct from the d10 tile.
const DIE_SHAPE_POINTS = {
    d4: '50,0 100,100 0,100',
    d8: '50,0 100,50 50,100 0,50',
    d10: '50,0 88,36 70,100 30,100 12,36',
    d12: '50,0 100,38 82,100 18,100 0,38',
    d20: '25,0 75,0 100,50 75,100 25,100 0,50',
    d100: '50,0 96,34 78,100 22,100 4,34'
}

function dieShapePoints(die) {
    return DIE_SHAPE_POINTS[die] || null
}

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

const ANIMATION_MS = 650
const TICK_MS = 70

const initial = loadConfig()
const dice = reactive(initial.dice)
const modifier = ref(initial.modifier)
const isRolling = ref(false)

// Holds the outcome of the roll currently animating/just finished. Cleared
// whenever the dice selection changes so a stale result can't keep showing
// for a combo you're no longer about to roll.
const rollState = ref(null)

let animationInterval = null
let animationTimeout = null

function stopAnimation() {
    clearInterval(animationInterval)
    clearTimeout(animationTimeout)
    animationInterval = null
    animationTimeout = null
}

onBeforeUnmount(stopAnimation)

watch([dice, modifier], () => {
    persistConfig()
    if (!isRolling.value) rollState.value = null
}, { deep: true })

const activeDice = computed(() => dice.filter(d => d.count > 0))

// Same shape as a settled roll, but with no numbers yet - lets the dice
// appear in the result area as soon as they're selected, before rolling.
const displayGroups = computed(() => {
    if (rollState.value) return rollState.value.groups
    return activeDice.value.map(d => ({ die: d.die, rolls: Array.from({ length: d.count }, () => null) }))
})

const displayTotal = computed(() => rollState.value?.total ?? null)

function increment(entry) {
    entry.count = Math.min(MAX_PER_DIE, entry.count + 1)
}

function decrement(entry) {
    entry.count = Math.max(0, entry.count - 1)
}

function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
}

function placeholderGroups(groups) {
    return groups.map(g => ({
        die: g.die,
        rolls: g.rolls.map(() => rollDie(Number(g.die.slice(1))))
    }))
}

function roll() {
    if (!activeDice.value.length || isRolling.value) return

    // The actual roll is decided and logged immediately - only the on-screen
    // reveal is delayed, so the animation is cosmetic and can never affect
    // (or lag behind) what actually gets recorded.
    const groups = activeDice.value.map(d => ({
        die: d.die,
        rolls: Array.from({ length: d.count }, () => rollDie(Number(d.die.slice(1))))
    }))

    const diceTotal = groups.reduce((sum, g) => sum + g.rolls.reduce((s, r) => s + r, 0), 0)
    const mod = Math.round(modifier.value) || 0
    modifier.value = mod
    const total = diceTotal + mod

    persistConfig()

    socket.emit('character:rollDice', {
        message: `Персонаж кинув кубики: ${total}`
    })

    stopAnimation()
    isRolling.value = true
    rollState.value = { groups: placeholderGroups(groups), total: null }

    animationInterval = setInterval(() => {
        rollState.value = { groups: placeholderGroups(groups), total: null }
    }, TICK_MS)

    animationTimeout = setTimeout(() => {
        stopAnimation()
        rollState.value = { groups, total }
        isRolling.value = false
    }, ANIMATION_MS)
}
</script>

<template>
    <div @click="emit('close')"
        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">

        <div @click.stop
            class="max-w-[420px] w-full mx-2 p-4 grid grid-cols-1 gap-3 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl relative font-gothic md:hover:cursor-default">

            <CloseButtonRedBG @click="emit('close')" />

            <h2 class="text-xl text-center">🎲 Кидок кубиків</h2>

            <div class="grid grid-cols-2 gap-2">
                <div v-for="entry in dice" :key="entry.die" class="dice-row flex items-center justify-center gap-2">
                    <span class="font-semibold text-lg">{{ entry.die }}</span>

                    <button @click="decrement(entry)"
                        class="w-10 h-10 rounded-lg border-2 border-darkred-light_gray md:hover:bg-darkred-gray/60 md:hover:cursor-pointer">
                        −
                    </button>

                    <span class="w-6 text-center tabular-nums">{{ entry.count }}</span>

                    <button @click="increment(entry)"
                        class="w-10 h-10 rounded-lg border-2 border-darkred-light_gray md:hover:bg-darkred-gray/60 md:hover:cursor-pointer">
                        +
                    </button>
                </div>
            </div>

            <label class="flex items-center gap-2 text-sm">
                Модифікатор
                <input v-model.number="modifier" type="number"
                    class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray" />
            </label>

            <AprroveButtonWithText text="Кинути" class="w-full h-12 flex justify-center items-center"
                :class="(!activeDice.length || isRolling) && 'opacity-50 pointer-events-none'" @click="roll" />

            <div v-if="displayGroups.length || modifier" class="space-y-2">
                <div class="flex gap-2 items-center justify-center flex-wrap">
                    <div v-for="g in displayGroups" :key="g.die">
                        <div class="text-xs text-center text-darkred-light_gray">{{ g.die }}</div>

                        <div class="flex flex-wrap gap-1.5 justify-center">
                            <div v-for="(r, i) in g.rolls" :key="i" class="dice-face relative w-10 h-10"
                                :class="isRolling && 'dice-face-rolling'">
                                <svg v-if="dieShapePoints(g.die)" viewBox="0 0 100 100"
                                    class="absolute inset-0 w-full h-full">
                                    <polygon :points="dieShapePoints(g.die)"
                                        class="fill-darkred-dark stroke-darkred-light_gray" stroke-width="6"
                                        stroke-linejoin="round" />
                                </svg>
                                <div v-else
                                    class="absolute inset-0 rounded-lg border-2 border-darkred-light_gray bg-darkred-dark">
                                </div>

                                <span v-if="r !== null"
                                    class="absolute inset-0 flex items-center justify-center font-bold tabular-nums">{{
                                        r }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="modifier != 0" class="text-center text-sm text-darkred-light_gray">
                    {{ modifier > 0 ? `+${modifier}` : modifier }}
                </div>

                <div v-if="displayTotal !== null || isRolling" class="text-center text-3xl font-bold"
                    :class="isRolling && 'animate-pulse'">
                    {{ displayTotal ?? '…' }}
                </div>

            </div>

        </div>

    </div>
</template>

<style scoped>
.dice-row:last-child {
    grid-column: span 2;
}

@keyframes dice-tumble {
    0% {
        transform: rotate(0deg) scale(1);
    }

    25% {
        transform: rotate(-18deg) scale(0.88);
    }

    50% {
        transform: rotate(12deg) scale(1.12);
    }

    75% {
        transform: rotate(-10deg) scale(0.92);
    }

    100% {
        transform: rotate(0deg) scale(1);
    }
}

.dice-face-rolling {
    animation: dice-tumble 0.3s ease-in-out infinite;
}
</style>
