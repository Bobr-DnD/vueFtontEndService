<script setup>
const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, required: true }
})
</script>

<template>
    <button :id="id"
                :class="active ? 'bg-greenish-mid border-greenish-mid text-darkred-dark' : 'border-darkred-dark_gray text-darkred-light'"
                class="px-3 py-1.5 border-2 rounded-full text-sm font-semibold md:hover:bg-darkred-gray/60 md:hover:cursor-pointer transition-colors duration-200">
                {{ label }}
            </button>
</template>
