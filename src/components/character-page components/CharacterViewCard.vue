<script setup>
import { computed, ref } from 'vue';
import { ArrowDownIcon } from '@heroicons/vue/24/solid';
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue';
import Header1 from '../reusable/Titles/Header1.vue';
import { CursorArrowRippleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    name: { type: String, required: true },
    image: { type: String, default: '' },
    gender: { type: String, required: true },
    race: { type: String, required: true },
    class: { type: String, required: true },
    characteristics: { type: Object, required: true },
    effects: { type: Array, required: true }
})

const character_fields = computed(() => props.gender || props.class || props.race)
const appliedEffects = computed(() => {
    return props.effects.filter(effect => effect.effect[selectedCharacteristic.value])
})

const modalHidden = ref(true)
const selectedCharacteristic = ref('')

</script>

<template>
    <img class="w-full h-[512px] top-0 object-cover object-top rounded-xl border-4 border-darkred-red shadow-md"
        :src="props.image ? props.image : 'https://placehold.co/400x400?text=Character'" alt="Character image" />

    <h1 class="p-2 bg-darkred-dark text-darkred-light text-3xl font-bold text-center rounded-lg shadow font-gothic">
        {{ props.name }}
    </h1>

    <div v-if="character_fields"
        class="flex flex-wrap items-center justify-center p-2 bg-darkred-dark_gray rounded-lg shadow-sm">
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

    <section class="border-2 border-darkred-dark p-2 rounded-lg relative">

        <CursorArrowRippleIcon class="w-5 h-5 absolute top-2 right-1"/>

        <div class="relative">
            <Header1 label="Характеристики" class="text-center font-bold text-darkred-red mb-1 cursor-pointer"
                @click="modalHidden = !modalHidden" />
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2">
            <div v-for="value, key in props.characteristics" :key="key.id"
                @click="modalHidden = !modalHidden"
                class="grow p-2 text-center rounded-lg border-2 border-darkred-red bg-darkred-dark text-darkred-light font-semibold hover:cursor-pointer">

                <div v-if="props.characteristics[key] > value" class="flex gap-2 justify-center items-center">
                    {{ value.name }} — {{ value.value }}
                    <ArrowDownIcon class="w-6 h-6 text-darkred-bright" />
                </div>

                <div v-else-if="props.characteristics[key] < value" class="flex gap-2 justify-center items-center">
                    {{ value.name }} — {{ value.value }}
                    <ArrowDownIcon class="w-6 h-6 rotate-180 text-greenish-light" />
                </div>

                <div v-else>
                    {{ value.name }} — {{ value.value }}
                </div>

            </div>
        </div>

        <div v-if="!modalHidden" class="modal-overlay flex items-center justify-center" @click="modalHidden = true">
            <div @click.stop
                class="max-w-[400px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl bg-darkred-dark text-darkred-light shadow-xl space-y-2 relative font-gothic text-lg hover:cursor-default">

                <CloseButtonRedBG @click="modalHidden = true" />
                <div class="h-6"></div>

                <Header1 label="Стандарті характеристики"
                    class="text-center font-semibold text-darkred-light mb-1 cursor-pointer" />

                <div class="flex flex-wrap items-center justify-center gap-2">
                    <div v-for="value, key in props.characteristics" :key="Math.random().toString(24).slice(2)"
                        @click="selectedCharacteristic = key"
                        class="grow p-2 text-center rounded-lg border-2 border-darkred-red bg-darkred-dark_gray text-darkred-light font-semibold hover:cursor-pointer">
                        <div>
                            {{ value.name }} — {{ value.value }}
                        </div>

                    </div>
                </div>

                <Header1 v-if="appliedEffects.length > 0" label="Поля, на які впливають ефекти:"
                    class="text-center text-darkred-light" />

                <div v-if="appliedEffects.length > 0" class="p-2 flex flex-col gap-2 bg-darkred-dark_gray rounded-2xl">
                    <div v-for="effect in appliedEffects"
                        class="p-2 rounded-lg even:bg-darkred-gray text-darkred-light even:text-darkred-dark">

                        <div>
                            Назва: {{ effect.name }}
                            <br>
                            Поля:
                            <template v-for="([key, value], index) in Object.entries(effect.effect)" :key="key">
                                <span
                                    :class="{ 'border-b-4 border-darkred-red font-semibold': key === selectedCharacteristic }"
                                    class="transition-colors">
                                    {{ key }}: {{ value }}
                                </span>
                                <span v-if="index < Object.entries(effect.effect).length - 1">, </span>
                            </template>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    </section>

</template>