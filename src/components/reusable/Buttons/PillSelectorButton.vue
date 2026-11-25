<script setup>
const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, required: true }
})
</script>

<template>
    <button :id="id"
                :class="active ? 'bg-state-success-accent border-state-success-accent text-brand-ink' : 'border-brand-surface text-brand-text'"
                class="px-3 py-1.5 border-2 rounded-full text-sm font-semibold md:hover:bg-brand-muted/60 md:hover:cursor-pointer transition-colors duration-200">
                {{ label }}
            </button>
</template>
