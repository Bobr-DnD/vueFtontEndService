<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true
})

let connected = ref(false)
const id = useRoute().params.id

onMounted(async () => {
    try {
        let res = await RepositoryFactory.getById('character', id)
        state.character = res.data
        res = await RepositoryFactory.getById('session', state.character.session)
        state.session = res.data

    } catch (err) {
        console.error(err)
    }
    finally {
        state.isLoading = false
    }
})

function addExperience() {
    state.character.experience++;
    if (state.character.experience >= state.character.experienceToLevelUp){
        state.character.experience = 0;
        state.character.perkPoints++;
    }
}
</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="w-80 mx-auto my-6 space-y-2 font-univers">

        <img class="w-full h-64 object-cover rounded-xl border-4 border-darkred-red shadow-md"
            src="https://placehold.co/400x200?text=Character" alt="Character image" />

        <h1 class="p-2 bg-darkred-dark text-darkred-light text-3xl font-bold text-center rounded-lg shadow font-gothic">
            {{ state.character.name }}
        </h1>

        <div class="flex flex-wrap items-center justify-center p-2 bg-darkred-dark_gray rounded-lg shadow-sm">
            <div class="grow text-center text-darkred-light font-medium text-lg">
                Стать: <span class="font-semibold">{{ state.character.gender }}</span>
            </div>
            <div class="grow text-center text-darkred-light font-medium text-lg">
                Клас: <span class="font-semibold">{{ state.character.class }}</span>
            </div>
        </div>

        <section>
            <h2 class="text-center text-2xl font-bold text-darkred-red mb-1">Характеристики</h2>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <div v-for="c, index in state.character.characteristics"
                    class="grow p-2 text-center rounded-lg border-2 border-darkred-red bg-darkred-dark text-darkred-light font-semibold">
                    {{ index }} — {{ c }}
                </div>
            </div>
        </section>

        <section>
            <h2 class="text-center text-lg font-semibold text-gray-600 mb-2">Додаткові характеристики</h2>
            <div class="flex flex-grow items-center justify-center gap-2">
                <div v-for="c, index in state.character.customFields"
                    class="grow p-2 text-center rounded-md border border-gray-300 bg-gray-50 text-gray-700 text-sm">
                    {{ index }} — {{ c }}
                </div>
            </div>
        </section>

        <div class="flex flex-wrap items-center justify-start">
            <div class="p-1 grow ">
                <div class="p-2 border-2 rounded-md border-darkred-dark">
                    <div class="text-sm mb-1 text-center font-medium">
                        Здоров'я: {{ state.character.health }}/{{ state.character.maxHealth }}
                    </div>
                    <div class="w-full h-5 bg-gray-300 rounded overflow-hidden">
                        <div class="h-full transition-all duration-300" :class="{
                            'bg-green-500': state.character.health / state.character.maxHealth > 0.6,
                            'bg-yellow-400': state.character.health / state.character.maxHealth <= 0.6 && state.character.health / state.character.maxHealth > 0.3,
                            'bg-red-500': state.character.health / state.character.maxHealth <= 0.3
                        }" :style="{ width: (state.character.health / state.character.maxHealth * 100) + '%' }"></div>
                    </div>
                </div>
            </div>

            <div class="p-1 grow">
                <div class="p-1 grow ">
                    <div class="p-2 border-2 rounded-md border-darkred-dark">
                        <div class="text-sm mb-1 text-center font-medium">
                            Досвід: {{ state.character.experience }}/{{ state.character.experienceToLevelUp }}
                        </div>
                        <div class="w-full h-5 bg-gray-300 rounded overflow-hidden">
                            <div class="h-full transition-all duration-300" :class="{
                                'bg-green-500': state.character.experience / state.character.experienceToLevelUp > 0.6,
                                'bg-yellow-400': state.character.experience / state.character.experienceToLevelUp <= 0.6 && state.character.experience / state.character.experienceToLevelUp > 0.3,
                                'bg-red-500': state.character.experience / state.character.experienceToLevelUp <= 0.3
                            }" :style="{ width: (state.character.experience / state.character.experienceToLevelUp * 100) + '%' }"></div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="p-1 grow">
                <div class="p-2 text-center border-2 rounded-md border-darkred-dark"> Очки рівня: {{
                    state.character.perkPoints }} </div>
            </div>
            <div class="p-1 grow"> <button @click="addExperience" class="w-full h-full p-2 rounded-lg border-2 border-darkred-red bg-darkred-dark_gray 
                text-darkred-light font-semibold tracking-wide hover:bg-darkred-red hover:text-darkred-light active:bg-darkred-bright active:scale-95 
                transition-all duration-200 ease-in-out Fshadow-md hover:shadow-lg">
                    +1 досвід </button> </div>
        </div>
    </div>


    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>