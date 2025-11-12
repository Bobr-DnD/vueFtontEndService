<script setup>
const props = defineProps({
    id: {type: String, required: true},
    label: {type: String, required: true},
    active: {type: Boolean, required: true}
})
</script>

<template>
    <button :id="id"
                :class="active ? 'bg-darkred-gray' : ''"
                class="p-2 border-4 border-darkred-dark_gray  rounded-lg text-xl font-gothic md:hover:bg-darkred-gray md:hover:cursor-pointer transition-colors duration-200">
                {{ label }}
            </button>
</template>