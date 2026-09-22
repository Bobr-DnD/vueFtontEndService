<script setup>
import { ref, computed } from 'vue';
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

const internalValue = ref(props.modelValue ?? props.minNum)
const value = computed({
    get: () => internalValue.value,
    set: (v) => {
        internalValue.value = v
        emit('update:modelValue', v)
    }
})

const dragging = ref(false)
const dragRatioUp = ref(0)
const dragRatioDown = ref(0)

const totalCost = computed(() => value.value * -props.price)

let startY = 0
let startValue = 0

function clamp(n) {
    return Math.min(props.maxNum, Math.max(props.minNum, n))
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(15)
}

function onPointerDown(e) {
    dragging.value = true
    startY = e.clientY
    startValue = value.value
    e.target.setPointerCapture(e.pointerId)
}

function onPointerMove(e) {
    if (!dragging.value) return

    const deltaY = startY - e.clientY
    const steps = Math.round(deltaY / PIXELS_PER_STEP)
    const next = clamp(startValue + steps)

    const range = props.maxNum - props.minNum || 1
    const ratio = Math.min(1, Math.abs(deltaY) / (PIXELS_PER_STEP * range))
    dragRatioUp.value = deltaY > 0 ? ratio : 0
    dragRatioDown.value = deltaY < 0 ? ratio : 0

    if (next !== value.value) {
        value.value = next
        vibrate()
    }
}

function onPointerUp(e) {
    dragging.value = false
    dragRatioUp.value = 0
    dragRatioDown.value = 0

    const finalValue = value.value
    value.value = 0
    if (finalValue !== 0) emit('release', finalValue, finalValue * props.price)

    e.target.releasePointerCapture?.(e.pointerId)
}

const upIconStyle = computed(() => ({
    filter: `saturate(${1 + dragRatioUp.value})`
}))

const downIconStyle = computed(() => ({
    filter: `saturate(${1 + dragRatioDown.value})`
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

        <button type="button"
            class="w-14 h-14 rounded-full shadow-lg touch-none flex flex-col items-center justify-center gap-0.5 bg-darkred-dark_gray border-2 border-darkred-gray md:hover:cursor-grab active:cursor-grabbing"
            @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp"
            @pointercancel="onPointerUp">
            <ChevronUpIcon class="w-5 h-5 text-greenish-light transition-[filter] duration-100 ease-out"
                :style="upIconStyle" />
            <ChevronDownIcon class="w-5 h-5 text-darkred-red transition-[filter] duration-100 ease-out"
                :style="downIconStyle" />
        </button>

    </div>
</template>
