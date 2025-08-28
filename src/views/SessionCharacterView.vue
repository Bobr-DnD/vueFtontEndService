<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/24/solid'
import test from '@/components/reusable/HorizontalNumberPicker.vue';
import RepositoryFactory from '@http/RepositoryFactory';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';
import WeaponRow from '@/components/reusable/WeaponRow.vue';
import ArmorRow from '@/components/reusable/ArmorRow.vue';
import MedsRow from '@/components/reusable/MedsRow.vue';
import InventoryRow from '@/components/reusable/InventoryRow.vue';
import PerkRow from '@/components/reusable/PerkRow.vue';
import FormNumber from '@/components/reusable/FormNumber.vue';
import FormString from '@/components/reusable/FormString.vue';

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
let custom_hidden = ref(true)
const characterId = useRoute().params.characterId

onMounted(async () => {
    try {
        let res = await RepositoryFactory.getById('character', characterId)
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
function checkHealth() {
    if (state.character.health > state.character.maxHealth) state.character.health = state.character.maxHealth
    if (state.character.health < 0) state.character.health = 0

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

        <div class="flex flex-wrap items-center justify-start">
            <!--<div class="p-1 grow ">
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
            </div>-->

            <div class="p-1 grow h-full">
                <div class="p-2 text-center border-2 rounded-md border-darkred-dark"> Очки рівня: {{
                    state.character.perkPoints }} </div>
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

            <div class="p-1 grow"> <button @click="addExperience" class="w-full h-full p-2 rounded-lg border-2 border-darkred-red bg-darkred-dark_gray 
                text-darkred-light font-semibold tracking-wide hover:bg-darkred-red hover:text-darkred-light active:bg-darkred-bright active:scale-95 
                transition-all duration-200 ease-in-out Fshadow-md hover:shadow-lg">
                    +1 досвід </button> </div>
        </div>
    </div>

    <div v-if="!state.isLoading" class="w-96 mx-auto my-4">

        <!--<section class="w-fit mx-auto flex items-center justify-center">

            <form class="flex items-center max-w-80 p-4 font-univers rounded-xl" @submit.prevent>
                <label for="Health" class="mr-2 w-full text-darkred-dark font-semibold text-lg tracking-wide">
                    Health:
                </label>
                <input @change="checkHealth" min="0" :max="state.character.maxHealth" id="Health" type="number"
                    v-model="state.character.health"
                    class="bg-darkred-gray max-w-28 text-darkred-light text-md placeholder-darkred-dark border no-arrows
                    border-darkred-dark rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
            </form>

            <button :disabled="state.character.health >= state.character.maxHealth" @click="state.character.health++"
                class="p-1 mx-2 border-2 rounded-md text-darkred-dark_gray" :class="state.character.health >= state.character.maxHealth
                    ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-greenish-light border-greenish-dark'
                    ">
                <ArrowUpIcon class="w-8 h-8" />
            </button>

            <button :disabled="state.character.health <= 0" @click="state.character.health--"
                class="p-1 mx-2 border-2 text-darkred-dark_gray rounded-md" :class="state.character.health <= 0
                    ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-darkred-bright border-darkred-red '
                    ">
                <ArrowDownIcon class="w-8 h-8" />
            </button>

        </section>-->

        <section class="mb-2">
            <div class="p-1 grow ">
                <div class="p-2 border-2 rounded-md border-darkred-dark">
                    <div class="text-md mb-1 text-center font-medium">
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

            <test v-model:health="state.character.health" :min="-state.character.health"
                :max="state.character.maxHealth - state.character.health" />

        </section>

        <section v-if="state.character.customFields">
            <h2 @click="custom_hidden = !custom_hidden"
                class="text-center text-xl font-semibold py-2  bg-darkred-dark text-darkred-light mb-2 rounded-lg hover:cursor-pointer">
                Додаткові характеристики</h2>
            <div v-if="!custom_hidden" v-for="value, field in state.character.customFields">
                <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + field" :entity_name="field"
                    v-model:value="state.character.customFields[field]"
                    class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

                <FormNumber v-if="typeof (value) === 'number'" :label="'CustomFields_' + field" :entity_name="field"
                    v-model:value="state.character.customFields[field]"
                    class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />
            </div>
        </section>
    </div>


    <div v-if="!state.isLoading" class="grid grid-cols-1 justify-items-center mx-auto min-w-fit max-w-sm">
        <h1
            class="w-4/5 text-center text-3xl font-bold text-darkred-dark_gray border-b-2 border-t-2 border-darkred-red rounded-lg mx-2">
            Інвентар</h1>

        <div class="mx-auto">
            <h1 @click="weapons_hidden = !weapons_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer">Зброя</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 w-11/12', weapons_hidden ? 'hidden' : '']">
            <WeaponRow :weapons_all="state.session.weapons" v-model:weapons="state.character.weapons" />
        </div>

        <div class="mx-auto">
            <h1 @click="armors_hidden = !armors_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer">Броня</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 w-11/12', armors_hidden ? 'hidden' : '']">
            <ArmorRow :armors_all="state.session.armors" v-model:armors="state.character.armor" />
        </div>

        <div class="mx-auto">
            <h1 @click="meds_hidden = !meds_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer">Медикаменти</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 w-11/12', meds_hidden ? 'hidden' : '']">
            <MedsRow :medicines_all="state.session.medicines" v-model:medicines="state.character.medicines" />
        </div>

        <div class="mx-auto">
            <h1 @click="inventories_hidden = !inventories_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer">Інвентар</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 w-11/12', inventories_hidden ? 'hidden' : '']">
            <InventoryRow :inventory_all="state.session.inventories" v-model:inventory="state.character.inventory" />
        </div>

        <div class="mx-auto">
            <h1 @click="perks_hidden = !perks_hidden" class="mx-auto my-3 w-fit p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer">Навчики</h1>
        </div>

        <div :class="['grid grid-cols-1 mx-2 max-w-full', perks_hidden ? 'hidden' : '']">
            <PerkRow :perks_all="state.session.perks" v-model:perks="state.character.perks"
                v-model:perkPoints="state.character.perkPoints" />
        </div>

    </div>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>

<style scoped>
.no-arrows::-webkit-outer-spin-button,
.no-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-arrows[type=number] {
    -moz-appearance: textfield;
}
</style>