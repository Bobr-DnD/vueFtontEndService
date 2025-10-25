<script setup>
import { computed, toRaw } from 'vue';

const props = defineProps({
    value: { type: Number, required: true },
    valueMax: { type: Number, required: true },
    text: { type: String, required: true },
    colors: {
        type: Array, default: [
            "#8E1616",
            "#FABC3F",
            "#3E5F44"
        ]
    }
})

const ratio = computed(() => props.value / props.valueMax)

const barColor = computed(() => {
  if (ratio.value > 0.75) return props.colors[0]
  if (ratio.value > 0.4) return props.colors[1]
  return props.colors[2]
})

const barStyle = computed(() => ({
  width: `${ratio.value * 100}%`,
  backgroundColor: barColor.value
}))
</script>

<template>
    <div class="p-2 border-2 rounded-md border-darkred-dark">
        <div class="text-md mb-1 text-center font-medium font-gothic">
            {{ text }}: {{ props.value }}/{{ props.valueMax }}
        </div>

        <div class="w-full h-5 bg-gray-300 rounded overflow-hidden">
            <div class="h-full transition-all duration-300 ease-in-out" :style="barStyle"></div>
        </div>

    </div>
</template>