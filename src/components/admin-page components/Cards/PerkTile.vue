<script setup>

const props = defineProps({
    perk: {
        type: Object,
        required: true
    }
})

</script>

<template>

    <div class="p-3 rounded-2xl bg-brand-base text-brand-text flex flex-col gap-2 cursor-pointer">

        <div class="text-xl font-medium">
            {{ props.perk.name }}
        </div>

        <div class="w-full p-2 bg-brand-surface rounded-lg">Опис: {{ props.perk.description }}</div>

    </div>

</template>