<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Loader from 'vue-spinner/src/SyncLoader.vue'

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';

import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';
import WeaponRow from '@/components/character-page components/WeaponRow.vue';
import ArmorRow from '@/components/character-page components/ArmorRow.vue';
import MedsRow from '@/components/character-page components/MedsRow.vue';
import InventoryRow from '@/components/character-page components/InventoryRow.vue';
import PerkRow from '@/components/character-page components/PerkRow.vue';

import EffectsTable from '@/components/character-page components/EffectsTable.vue';
import QuestsTable from '@/components/character-page components/QuestsTable.vue';
import CustomFieldsTable from '@/components/character-page components/CustomFieldsTable.vue';
import characterCardSmall from '@/components/character-page components/characterCardSmall.vue';
import Experience from '@/components/character-page components/Experience.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';

import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

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
const characterId = useRoute().params.characterId
const sessionId = useRoute().params.sessionId

onMounted(async () => {
    const [resCharacter, errCharacter] = await asyncHandler(
        RepositoryFactory.getById('character', characterId)
    )
    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )

    if (errCharacter) {
        console.warn(errCharacter.message)
        return
    }
    else if (errSession) {
        console.warn(errSession.message)
        return
    }
    else state.isLoading = false

    state.character = resCharacter.data
    state.session = resSession.data
})

async function updateCharacter() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.update('character', characterId, state.character)
    )
    if (err) {
        console.warn(err.message)
        return
    }
    return res.data
}

async function updateSession() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.update('session', sessionId, state.session)
    )
    if (err) {
        console.warn(err.message)
        return
    }

    return res.data
}

async function addExperience() {
    state.character.experience++;
    if (state.character.experience >= state.character.experienceToLevelUp) {
        state.character.experience = 0;
        state.character.perkPoints++;
        state.character.level++;
    }
    state.character = await updateCharacter()
}

async function updateHealth(health) {
    state.character.health += health
    state.character = await updateCharacter()
}

async function updateCurrency(currency) {
    state.session.currency = currency
    state.session = await updateSession()
}

async function updateCustomFields(fields) {
    state.character.customFields = fields
    state.character = await updateCharacter()
}
</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="w-80 mx-auto my-6 space-y-2 font-univers">

        <characterCardSmall :name="state.character.name" :characteristics="state.character.characteristics"
            :gender="state.character.gender" :class="state.character.class" />

        <Experience :exp="state.character.experience" :expMax="state.character.experienceToLevelUp"
            :perkPoints="state.character.perkPoints" @addExperience="addExperience" />

    </div>

    <div v-if="!state.isLoading" class="w-96 mx-auto my-4">

        <section class="mb-2">

            <div class="p-1 grow ">
                <ProgressiveBar :value="state.character.health" :valueMax="state.character.maxHealth" text="Здоров'я" />
            </div>

            <HorizontalNumberPicker :value="state.character.health" :min="-state.character.health"
                :max="state.character.maxHealth - state.character.health" @changeValue="updateHealth" />

        </section>

        <section class="grid grid-cols-1 gap-2 w-full mx-auto my-4">
            <EffectsTable :effects="state.character.effects" />
        </section>

        <section class="w-full mx-auto my-4">
            <QuestsTable :quest="state.character.quest" />
        </section>

        <section class="w-full mx-auto my-4">
            <CustomFieldsTable :fields="state.character.customFields" @updateFields="updateCustomFields" />
        </section>

        <section v-if="!state.isLoading" class="w-full mx-auto my-4">
            <CurrencyTable :currency="state.session.currency" @updateCurrency="updateCurrency" />
        </section>
    </div>


    <!--TODO refactor-->
    
    <!--<div v-if="!state.isLoading" class="grid grid-cols-1 justify-items-center mx-auto min-w-80 max-w-96">

        <div class="mx-auto">

            <h1 @click="perks_hidden = !perks_hidden"
                class="mx-auto w-64 my- p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer select-none font-gothic grid grid-cols-[40px_1fr_60px] items-center justify-items-center">
                <CheckBadgeIcon class="w-8 h-8" />
                Навчики
                <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                    :class="perks_hidden ? 'rotate-180' : 'rotate-0'" />
            </h1>

        </div>

        <div :class="['grid grid-cols-1 mx-2 w-full', perks_hidden ? 'hidden' : '']">
            <PerkRow :perks_all="state.session.perks" v-model:perks="state.character.perks"
                v-model:perkPoints="state.character.perkPoints" />
        </div>

        <div class="mx-auto">

            <h1 @click="weapons_hidden = !weapons_hidden" class="mx-auto w-52 my-3 p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray
             text-center text-3xl font-bold text-darkred-light border-2 rounded-xl
             hover:cursor-pointer select-none font-gothic grid grid-cols-[40px_1fr_60px]
             items-center justify-items-center">

                <BoltIcon class="w-8 h-8" />
                Зброя
                <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                    :class="weapons_hidden ? 'rotate-180' : 'rotate-0'" />

            </h1>

        </div>

        <div :class="['grid grid-cols-1 mx-2 w-full py-2', weapons_hidden ? 'hidden' : '']">
            <WeaponRow :weapons_all="state.session.weapons" v-model:weapons="state.character.weapons" />
        </div>-->

    <!--<div class="mx-auto">

            <h1 @click="armors_hidden = !armors_hidden"
                class="mx-auto my-3 w-52 p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer select-none font-gothic grid grid-cols-[40px_1fr_60px] items-center justify-items-center">
                <ShieldCheckIcon class="w-8 h-8" />
                Броня
                <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                    :class="armors_hidden ? 'rotate-180' : 'rotate-0'" />
            </h1>

        </div>

        <div :class="['grid grid-cols-1 mx-2 w-full', armors_hidden ? 'hidden' : '']">
            <ArmorRow :armors_all="state.session.armors" v-model:armors="state.character.armor" />
        </div>-->

    <!--<div class="mx-auto">

            <h1 @click="meds_hidden = !meds_hidden"
                class="mx-auto my-3 w-80 p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer select-none font-gothic grid grid-cols-[40px_1fr_60px] items-center justify-items-center">
                <BeakerIcon class="w-8 h-8" />
                Медикаменти
                <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                    :class="meds_hidden ? 'rotate-180' : 'rotate-0'" />
            </h1>

        </div>

        <div :class="['grid grid-cols-1 mx-2 w-full', meds_hidden ? 'hidden' : '']">
            <MedsRow :medicines_all="state.session.medicines" v-model:medicines="state.character.medicines" />
        </div>

        <div class="mx-auto">

            <h1 @click="inventories_hidden = !inventories_hidden"
                class="mx-auto my-3 w-64 p-2 bg-gradient-to-tr from-darkred-bright to-darkred-dark_gray text-center text-3xl font-bold text-darkred-light border-2 
            rounded-xl hover:cursor-pointer select-none font-gothic grid grid-cols-[40px_1fr_60px] items-center justify-items-center">
                <ArchiveBoxIcon class="w-8 h-8" />
                Інвентар
                <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                    :class="inventories_hidden ? 'rotate-180' : 'rotate-0'" />
            </h1>

        </div>

        <div :class="['grid grid-cols-1 mx-2 w-full', inventories_hidden ? 'hidden' : '']">
            <InventoryRow :inventory_all="state.session.inventories" v-model:inventory="state.character.inventory" />
        </div>

    </div>-->

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>