<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { CheckBadgeIcon, ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/vue/24/solid'

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
import HideTittle from '@/components/reusable/HideTittle.vue';

import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true,
    connected: false
})

let perks_hidden = ref(false)
let weapons_hidden = ref(true)
let armors_hidden = ref(true)
let meds_hidden = ref(true)
let inventories_hidden = ref(true)

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

    console.log(state.character.effects);

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

async function updateInventory() {
    state.character = await updateCharacter()
}
</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="w-80 mx-auto my-6 space-y-2 font-univers">

        <characterCardSmall :name="state.character.name" :characteristics="state.character.characteristics"
            :gender="state.character.gender" :class="state.character.class" />

        <Experience :exp="state.character.experience" :expMax="state.character.experienceToLevelUp"
            :perkPoints="state.character.perkPoints" :callback="addExperience" />

    </div>

    <div v-if="!state.isLoading" class="w-96 mx-auto my-4">

        <section class="mb-2">

            <div class="p-1 grow ">
                <ProgressiveBar :value="state.character.health" :valueMax="state.character.maxHealth" text="Здоров'я" />
            </div>

            <HorizontalNumberPicker :value="state.character.health" :min="-state.character.health"
                :max="state.character.maxHealth - state.character.health" :callback="updateHealth" />

        </section>

        <section class="grid grid-cols-1 gap-2 w-full mx-auto my-2">

            <EffectsTable :effects="state.character.effects" />

            <QuestsTable :quest="state.character.quest" />

            <CustomFieldsTable :fields="state.character.customFields" :callback="updateCustomFields" />

            <CurrencyTable :currency="state.session.currency" :callback="updateCurrency" />
        </section>
    </div>

    <section v-if="!state.isLoading" class="grid grid-cols-1 justify-items-center mx-auto min-w-80 max-w-96">

        <HideTittle text="Навички" :mainIcon="CheckBadgeIcon" v-model:hidden="perks_hidden" />
        <div :class="['grid grid-cols-1 w-full', perks_hidden ? 'hidden' : '']">
            <PerkRow v-if="state.session.perks" :perks_all="state.session.perks" v-model:perks="state.character.perks"
                v-model:perkPoints="state.character.perkPoints" />
        </div>

        <HideTittle text="Зброя" :mainIcon="BoltIcon" v-model:hidden="weapons_hidden" />
        <div :class="['grid grid-cols-1 w-full', weapons_hidden ? 'hidden' : '']">
            <WeaponRow :weapons_all="state.session.weapons" :weapons="state.character.weapons"
                :callback="updateInventory" />
        </div>

        <HideTittle text="Броня" :mainIcon="ShieldCheckIcon" v-model:hidden="armors_hidden" />
        <div :class="['grid grid-cols-1 w-full', armors_hidden ? 'hidden' : '']">
            <ArmorRow :armors_all="state.session.armors" :armors="state.character.armor" :callback="updateInventory" />
        </div>

        <HideTittle text="Медикаменти" :mainIcon="BeakerIcon" v-model:hidden="meds_hidden" />
        <div :class="['grid grid-cols-1 w-full', meds_hidden ? 'hidden' : '']">
            <MedsRow :medicines_all="state.session.medicines" :medicines="state.character.medicines"
                :effects_all="state.session.effects" :effects="state.character.effects" :move="state.session.move"
                :callback="updateInventory" />
        </div>

        <HideTittle text="Інвентар" :mainIcon="ArchiveBoxIcon" v-model:hidden="inventories_hidden" />
        <div :class="['grid grid-cols-1 w-full', inventories_hidden ? 'hidden' : '']">
            <InventoryRow :inventory_all="state.session.inventories" :inventory="state.character.inventory"
                :callback="updateInventory" />
        </div>

    </section>

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