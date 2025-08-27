<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';
import WeaponRow from '@/components/reusable/WeaponRow.vue';
import ArmorRow from '@/components/reusable/ArmorRow.vue';
import MedsRow from '@/components/reusable/MedsRow.vue';
import InventoryRow from '@/components/reusable/InventoryRow.vue';
import PerkRow from '@/components/reusable/PerkRow.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true
})

let connected = ref(false)
let weapons_hidden = ref(false)
let armors_hidden = ref(false)
let meds_hidden = ref(false)
let inventories_hidden = ref(false)
let perks_hidden = ref(false)
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
        state.isLoading = false;
    }
})

function addExperience() {
    state.character.experience++;
    if (state.character.experience >= state.character.experienceToLevelUp) {
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
                            }"
                                :style="{ width: (state.character.experience / state.character.experienceToLevelUp * 100) + '%' }">
                            </div>
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


    <div v-if="!state.isLoading" class="grid grid-cols-1 justify-items-center mx-auto min-w-fit max-w-sm">
        <h1
            class="w-4/5 text-center text-3xl font-bold text-darkred-dark_gray border-b-2 border-t-2 border-darkred-red rounded-lg mx-2">
            Інвентар</h1>

        <div class="mx-auto">
            <h1 @click="weapons_hidden = !weapons_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-md hover:cursor-pointer">Зброя</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', weapons_hidden ? 'hidden' : '']">
            <WeaponRow :weapons_all="state.session.weapons" v-model:weapons="state.character.weapons" />
        </div>

        <div class="mx-auto">
            <h1 @click="armors_hidden = !armors_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-md hover:cursor-pointer">Броня</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', armors_hidden ? 'hidden' : '']">
            <ArmorRow :armors_all="state.session.armors" v-model:armors="state.character.armor" />
        </div>

        <div class="mx-auto">
            <h1 @click="meds_hidden = !meds_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-md hover:cursor-pointer">Медикаменти</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', meds_hidden ? 'hidden' : '']">
            <MedsRow :medicines_all="state.session.medicines" v-model:medicines="state.character.medicines" />
        </div>

        <div class="mx-auto">
            <h1 @click="inventories_hidden = !inventories_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-md hover:cursor-pointer">Інвентар</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', inventories_hidden ? 'hidden' : '']">
            <InventoryRow :inventory_all="state.session.inventories" v-model:inventory="state.character.inventory" />
        </div>

        <div class="mx-auto">
            <h1 @click="perks_hidden = !perks_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-md hover:cursor-pointer">Навчики</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', perks_hidden ? 'hidden' : '']">
            <PerkRow :perks_all="state.session.perks" v-model:perks="state.character.perks" v-model:perkPoints="state.character.perkPoints"/>
        </div>

    </div>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>