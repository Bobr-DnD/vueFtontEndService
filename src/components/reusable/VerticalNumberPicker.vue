<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    maxNum: {
        type: Number,
        required: true
    },
    minNum: {
        type: Number,
        required: true
    },
    modelValue: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['update:modelValue', 'release'])

const PIXELS_PER_STEP = 50
const WHEEL_STEP = 50
const MOVE_THRESHOLD = 4

const internalValue = ref(props.modelValue ?? props.minNum)
const value = computed({
    get: () => internalValue.value,
    set: (v) => {
        internalValue.value = v
        emit('update:modelValue', v)
    }
})

const active = ref(false)
const pulseDirection = ref(null)
const showHint = ref(false)

const totalCost = computed(() => value.value * -props.price)

const buttonEl = ref(null)
let hintTimeoutId = null
let pulseTimeoutId = null
let wheelAccum = 0

let dragging = false
let startY = 0
let startValue = 0
let hasMoved = false

function clamp(n) {
    return Math.min(props.maxNum, Math.max(props.minNum, n))
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(15)
}

function pulse(direction) {
    pulseDirection.value = direction
    if (pulseTimeoutId) clearTimeout(pulseTimeoutId)
    pulseTimeoutId = setTimeout(() => {
        pulseDirection.value = null
        pulseTimeoutId = null
    }, 150)
}

function applyValue(next) {
    if (next === value.value) return
    const direction = next > value.value ? 'up' : 'down'
    value.value = next
    vibrate()
    pulse(direction)
}

function step(direction) {
    applyValue(clamp(value.value + direction))
}

function showHintTemporarily() {
    showHint.value = true
    if (hintTimeoutId) clearTimeout(hintTimeoutId)
    hintTimeoutId = setTimeout(() => {
        showHint.value = false
        hintTimeoutId = null
    }, 3000)
}

function finalize() {
    const finalValue = value.value
    value.value = 0
    if (finalValue !== 0) emit('release', finalValue, finalValue * props.price)
}

function arm() {
    active.value = true
    showHintTemporarily()
}

function disarm() {
    if (!active.value) return
    active.value = false
    showHint.value = false
    if (hintTimeoutId) {
        clearTimeout(hintTimeoutId)
        hintTimeoutId = null
    }
    finalize()
}

// Tracks every press so a tap (no movement) can arm/disarm, but only acts on
// the movement (preventDefault + value changes) once armed - while idle the
// gesture is left alone so the page scrolls normally, even if it started on
// this button.
function onPointerDown(e) {
    dragging = true
    startY = e.clientY
    startValue = value.value
    hasMoved = false
    e.target.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e) {
    if (!dragging) return

    const deltaY = startY - e.clientY
    if (Math.abs(deltaY) > MOVE_THRESHOLD) hasMoved = true

    if (!active.value) return

    e.preventDefault()

    const steps = Math.round(deltaY / PIXELS_PER_STEP)
    applyValue(clamp(startValue + steps))
}

function onPointerUp(e) {
    dragging = false
    e.target.releasePointerCapture?.(e.pointerId)

    // A drag either adjusted the value live (if armed) or was left as a plain
    // page scroll (if idle) - either way, don't also toggle arm state.
    if (hasMoved) return

    if (active.value) disarm()
    else arm()
}

function onPointerCancel(e) {
    dragging = false
    e.target.releasePointerCapture?.(e.pointerId)
}

// Desktop mouse wheel / trackpad convenience - only intercepts (and blocks
// page scroll) while armed, so idle scrolling over the button is unaffected.
function onWheel(e) {
    if (!active.value) return
    e.preventDefault()

    wheelAccum += e.deltaY
    while (Math.abs(wheelAccum) >= WHEEL_STEP) {
        const direction = wheelAccum > 0 ? -1 : 1
        wheelAccum -= Math.sign(wheelAccum) * WHEEL_STEP
        step(direction)
    }
}

function onKeydown(e) {
    if (e.key === 'Escape' && active.value) disarm()
}

onMounted(() => {
    buttonEl.value?.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
    buttonEl.value?.removeEventListener('wheel', onWheel)
    document.removeEventListener('keydown', onKeydown)
    if (hintTimeoutId) clearTimeout(hintTimeoutId)
    if (pulseTimeoutId) clearTimeout(pulseTimeoutId)
})

const upIconStyle = computed(() => ({
    filter: `saturate(${pulseDirection.value === 'up' ? 2 : 1})`
}))

const downIconStyle = computed(() => ({
    filter: `saturate(${pulseDirection.value === 'down' ? 2 : 1})`
}))
</script>

<template>
    <div class="w-full flex items-center justify-between gap-4 p-3 bg-darkred-dark_gray rounded-2xl select-none">

        <div class="flex gap-1">
            <div class="text-3xl font-semibold font-univers tabular-nums"
                :class="value > 0 ? 'text-greenish-light' : value < 0 ? 'text-darkred-red' : 'text-darkred-light'">
                {{ value > 0 ? `+${value}` : value }}
            </div>

            <div v-if="price" class="text-sm font-univers tabular-nums"
                :class="totalCost > 0 ? 'text-greenish-light' : totalCost < 0 ? 'text-darkred-red' : 'text-darkred-light_gray'">
                {{ totalCost > 0 ? `+${totalCost}` : totalCost }}
            </div>
        </div>

        <div class="relative z-50">
            <div v-if="showHint"
                class="absolute bottom-full mb-2 right-0 w-40 max-w-[60vw] px-3 py-1.5 rounded-lg bg-darkred-dark text-darkred-light text-sm font-univers text-center shadow-lg z-10">
                Прокрути або проведи пальцем, тапни щоб підтвердити
            </div>

            <button ref="buttonEl" type="button" :aria-pressed="active"
                class="w-14 h-14 rounded-full shadow-lg flex flex-col items-center justify-center gap-0.5 bg-darkred-dark_gray border-2 transition-colors duration-150 md:hover:cursor-pointer"
                :class="active ? 'border-greenish-light ring-4 ring-greenish-light/30 touch-none' : 'border-darkred-gray'"
                @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp"
                @pointercancel="onPointerCancel">
                <ChevronUpIcon class="w-5 h-5 text-greenish-light transition-[filter] duration-100 ease-out"
                    :style="upIconStyle" />
                <ChevronDownIcon class="w-5 h-5 text-darkred-red transition-[filter] duration-100 ease-out"
                    :style="downIconStyle" />
            </button>
        </div>

        <div v-if="active" class="fixed inset-0 z-40" @click="disarm"></div>

    </div>
</template>
