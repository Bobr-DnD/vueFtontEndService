<script setup>
const props = defineProps({
    name: { type: String, required: true },
    image: { type: String, default: '' },
    gender: { type: String, required: true },
    race: { type: String, required: true },
    class: { type: String, required: true },
    characteristics: { type: Object, required: true },
})
</script>

<template>
    <img class="w-full h-64 object-cover object-top rounded-xl border-4 border-darkred-red shadow-md"
        :src="props.image.length > 0 ? props.image : 'https://placehold.co/400x200?text=Character'"
        alt="Character image" />

    <h1 class="p-2 bg-darkred-dark text-darkred-light text-3xl font-bold text-center rounded-lg shadow font-gothic">
        {{ props.name }}
    </h1>

    <div class="flex flex-wrap items-center justify-center p-2 bg-darkred-dark_gray rounded-lg shadow-sm">
        <div class="grow text-center text-darkred-light font-medium text-lg">
            Стать: <span class="font-semibold">{{ props.gender }}</span>
        </div>
        <div class="grow text-center text-darkred-light font-medium text-lg">
            Клас: <span class="font-semibold">{{ props.class }}</span>
        </div>
        <div class="grow text-center text-darkred-light font-medium text-lg">
            Раса: <span class="font-semibold">{{ props.race }}</span>
        </div>
    </div>

    <section>
        <h2 class="text-center text-2xl font-bold text-darkred-red mb-1">Характеристики</h2>
        <div class="flex flex-wrap items-center justify-center gap-2">
            <div v-for="c, index in props.characteristics"
                class="grow p-2 text-center rounded-lg border-2 border-darkred-red bg-darkred-dark text-darkred-light font-semibold">
                {{ index }} — {{ c }}
            </div>
        </div>
    </section>
</template>