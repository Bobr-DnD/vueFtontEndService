<script setup>
import { computed } from 'vue';
const props = defineProps({
    name: { type: String, required: true },
    image: { type: String, default: '' },
    gender: { type: String, required: true },
    race: { type: String, required: true },
    class: { type: String, required: true },
    characteristics: { type: Object, required: true },
})

const character_fields = computed(() => props.gender || props.class ||props.race)

</script>

<template>
    <img class="w-full h-96 object-cover object-top rounded-xl border-4 border-darkred-red shadow-md"
        :src="props.image ? props.image : 'https://placehold.co/400x400?text=Character'"
        alt="Character image" />

    <h1 class="p-2 bg-darkred-dark text-darkred-light text-3xl font-bold text-center rounded-lg shadow font-gothic">
        {{ props.name }}
    </h1>

    <div v-if="character_fields" class="flex flex-wrap items-center justify-center p-2 bg-darkred-dark_gray rounded-lg shadow-sm">
        <div v-if="props.gender" class="grow text-center text-darkred-light font-medium text-lg">
            Стать: <span class="font-semibold">{{ props.gender }}</span>
        </div>
        <div v-if="props.class" class="grow text-center text-darkred-light font-medium text-lg">
            Клас: <span class="font-semibold">{{ props.class }}</span>
        </div>
        <div v-if="props.race" class="grow text-center text-darkred-light font-medium text-lg">
            Раса: <span class="font-semibold">{{ props.race }}</span>
        </div>
    </div>

    <section>
        <h2 class="text-center text-2xl font-bold text-darkred-red mb-1">Характеристики</h2>
        <div class="flex flex-wrap items-center justify-center gap-2">
            <div v-for="c, index in props.characteristics" :key="Math.random().toString(24).slice(2)"
                class="grow p-2 text-center rounded-lg border-2 border-darkred-red bg-darkred-dark text-darkred-light font-semibold">
                {{ index }} — {{ c }}
            </div>
        </div>
    </section>
</template>