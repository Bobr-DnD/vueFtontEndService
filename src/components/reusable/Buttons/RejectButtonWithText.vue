<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div
        class="p-2 bg-darkred-red md:hover:bg-darkred-red/75 rounded-xl border-2 border-darkred-dark text-darkred-light font-medium md:hover:cursor-pointer select-none flex justify-center items-center">
        {{ props.text }}
    </div>
</template>