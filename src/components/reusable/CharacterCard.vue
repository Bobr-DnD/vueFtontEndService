<script setup>
import { RouterLink, useRoute } from 'vue-router';
const props = defineProps({
    character: {
        type: Object,
        required: true
    },
    routing: {
        type: Boolean,
        required: false,
        default: false
    }
})

const sessionId = useRoute().params.sessionId

</script>

<template>
    <div class="m-4 p-2 rounded-xl border-4 border-darkred-dark font-gothic text-lg h-full w-80 flex flex-col gap-3">
        <div class="w-full flex flex-col items-center gap-3">

            <RouterLink v-if="props.routing" :to="'/session/' + sessionId + '/character/' + props.character.id"
                class="w-full">
                <img class="w-full min-h-auto max-h-80 object-cover object-top rounded-xl border-darkred-red border-4"
                    :src="character.image? character.image : 'https://placehold.co/400x200?text=Character'"
                    alt="Character image" />
            </RouterLink>

            <img v-else class="w-full h-48 object-cover object-top rounded-xl border-darkred-red border-4"
                :src="character.image.legth > 0 ? character.image : 'https://placehold.co/400x200?text=Character'"
                alt="Character image" />

            <RouterLink v-if="props.routing" :to="'/session/' + sessionId + '/character/' + props.character.id"
                class="font-semibold text-2xl bg-darkred-red text-darkred-light rounded-lg p-2">{{ props.character.name
                }}</RouterLink>

            <div v-else class="font-semibold text-2xl">{{ props.character.name }}</div>
            
        </div>

        <!-- <div
            class="flex flex-wrap justify-around items-center mb-2 space-y-1 text-lg border-b-2 border-darkred-gray rounded-lg">
            <div class="">Стать: {{ props.character.gender }}</div>
            <div class="">Клас: {{ props.character.class }}</div>
        </div> -->

        <div
            class="grid auto-rows-max grid-cols-2 items-center justify-items-center mb-3 border-y-2 border-darkred-red rounded-md">
            <div>Рівень: {{ props.character.level }}</div>
            <div>Досвід: {{ props.character.experience }}/{{ props.character.experienceToLevelUp }}</div>
            <div class="col-span-2" v-for="h in props.character.health">{{ h.name }}: {{ h.value }}/{{ h.max }}</div>
        </div>

        <div v-if="!props.routing" class="border-b-2 border-darkred-bright rounded-lg mb-4">
            <div class="text-center border-t-2 border-darkred-bright rounded-lg">Характеристики:</div>
            <div class="flex flex-wrap items-center justify-start">
                <div class="p-2 grow" v-for="c, index in props.character.characteristics">
                    <div class="p-1 text-center border-2 rounded-md border-darkred-dark">{{ index }} - {{ c }}</div>
                </div>
            </div>
        </div>
    </div>

</template>