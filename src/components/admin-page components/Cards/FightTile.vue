<script setup>
defineProps({
    fight: { type: Object, required: true }
})
</script>

<template>
    <div class="p-3 rounded-2xl bg-darkred-dark text-darkred-light flex flex-col gap-2 cursor-pointer">

        <div class="flex items-center justify-between gap-2">
            <div class="text-xl font-medium">{{ fight.name }}</div>
            <span v-if="fight.isActive" class="text-xs px-2 py-1 rounded-full bg-greenish-dark shrink-0">Активний</span>
        </div>

        <div class="p-2 bg-darkred-dark_gray rounded-lg text-sm">
            {{ fight.enemies?.length ?? 0 }} ворогів · {{ fight.participants?.length ?? 0 }} учасників
        </div>
    </div>
</template>
