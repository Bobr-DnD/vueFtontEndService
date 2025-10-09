<script setup>

const props = defineProps({
    value: {type: Number, required: true},
    valueMax: {type: Number, required: true},
    text: {type: String, required: true}
})
</script>

<template>
    <div class="p-2 border-2 rounded-md border-darkred-dark">
        <div class="text-md mb-1 text-center font-medium font-gothic">
            {{ text }}: {{ props.value }}/{{ props.valueMax }}
        </div>

        <div class="w-full h-5 bg-gray-300 rounded overflow-hidden">
            <div class="h-full transition-all duration-300" :class="{
                'bg-green-500': props.value / props.valueMax > 0.6,
                'bg-yellow-400': props.value / props.valueMax <= 0.6 && props.value / props.valueMax > 0.3,
                'bg-red-500': props.value / props.valueMax <= 0.3
            }" :style="{ width: (props.value / props.valueMax * 100) + '%' }"></div>
        </div>

    </div>
</template>