<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { SparklesIcon, CurrencyDollarIcon, FlagIcon, CheckBadgeIcon, ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, ChartBarIcon, BoltIcon, ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'
import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';
import WeaponRow from '@/components/reusable/WeaponRow.vue';
import ArmorRow from '@/components/reusable/ArmorRow.vue';
import MedsRow from '@/components/reusable/MedsRow.vue';
import InventoryRow from '@/components/reusable/InventoryRow.vue';
import PerkRow from '@/components/reusable/PerkRow.vue';
import FormNumber from '@/components/reusable/FormNumber.vue';
import FormString from '@/components/reusable/FormString.vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true
})

let effects_text = ref('Показати активні ефекти')
let customFields_text = ref('Показати додаткові характеристики')
let currency_text = ref('Показати баланс')
let quest_text = ref('Показати особистий квест')
let connected = ref(false)
let weapons_hidden = ref(false)
let armors_hidden = ref(false)
let meds_hidden = ref(false)
let inventories_hidden = ref(false)
let perks_hidden = ref(false)
let custom_hidden = ref(true)
let effects_hidden = ref(true)
let currency_hidden = ref(true)
let quest_hidden = ref(true)
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

        <section class="mb-2">

            <div class="p-1 grow ">

                <div class="p-2 border-2 rounded-md border-darkred-dark">
                    <div class="text-md mb-1 text-center font-medium font-gothic">
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

            <HorizontalNumberPicker :health="state.character.health" :min="-state.character.health"
                :max="state.character.maxHealth - state.character.health" @changeValue="updateHealth" />

        </section>

        <section v-if="state.character.customFields">

            <h2 @click="custom_hidden = !custom_hidden;
            customFields_text === 'Показати додаткові характеристики'
                ? customFields_text = 'Приховати додаткові характеристики'
                : customFields_text = 'Показати додаткові характеристики'" class="px-4 py-2 text-center text-xl font-univers font-semibold text-ellipsis mb-2 rounded-lg hover:cursor-pointer transition-all duration-500 
                ease-in-out select-none grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
                :class="custom_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

                <ChartBarIcon class="w-8 h-8" />
                {{ customFields_text }}
                <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                    :class="custom_hidden ? 'rotate-180' : 'rotate-0'" />
            </h2>

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

    <section v-if="!state.isLoading" class="grid grid-cols-1 gap-2 w-96 mx-auto my-4">
        <button @click="effects_hidden = !effects_hidden; effects_text === 'Показати активні ефекти'
            ? (effects_text = 'Приховати активні ефекти')
            : (effects_text = 'Показати активні ефекти')"
            class="px-4 py-2 rounded-xl font-univers font-semibold text-xl transition-all duration-500 ease-in-out grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
            :class="effects_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

            <SparklesIcon class="w-8 h-8" />
            {{ effects_text }}
            <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                :class="effects_hidden ? 'rotate-180' : 'rotate-0'" />
        </button>


        <div v-if="!effects_hidden" class="space-y-2 font-univers">

            <div class="grid grid-cols-[1fr_1fr_min-content] p-2 gap-2 justify-items-center items-center bg-darkred-dark_gray  
                border-darkred-gray rounded-xl shadow-sm text-darkred-light">
                <div>
                    Назва
                </div>
                <div>
                    Ефект
                </div>
                <div class="justify-self-end">
                    Тривалість
                </div>
            </div>

            <div v-for="effect in state.character.effects" class="grid grid-cols-[1fr_1fr_80px] gap-2 p-3 justify-items-center items-center
         bg-darkred-dark_gray  border-darkred-gray rounded-xl shadow-sm text-darkred-light">

                <div class="text-lg font-semibold">
                    {{ effect.effect.name }}
                </div>

                <div class="text-sm">
                    {{ effect.effect.description }}
                </div>

                <div class="text-md font-medium px-2 py-1 rounded-lg bg-darkred-dark">
                    {{ effect.deathTime }}
                </div>
            </div>
        </div>

    </section>

    <section v-if="state.character.quest && !state.isLoading" class="w-96 mx-auto my-4">

        <h2 @click="
            quest_hidden = !quest_hidden;
        quest_text === 'Показати особистий квест'
            ? quest_text = 'Приховати особистий квест'
            : quest_text = 'Показати особистий квест'" class="px-4 py-2 text-center text-xl font-univers font-semibold mb-2 rounded-lg hover:cursor-pointer transition-all duration-500 
            ease-in-out select-none grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
            :class="quest_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

            <FlagIcon class="w-8 h-8" />
            {{ quest_text }}
            <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                :class="quest_hidden ? 'rotate-180' : 'rotate-0'" />
        </h2>

        <div v-if="!quest_hidden" class="border-2 rounded-lg border-darkred-dark_gray p-1">

            <div class="w-full text-center text-2xl font-semibold font-gothic">
                {{ state.character.quest.name }}
            </div>

            <div v-for="step in state.character.quest.steps" class="text-md font-univers font-medium">

                <div v-if="step.status === 'fail'">
                    • <span class="line-through decoration-2 decoration-darkred-red">{{ step.name }}</span>
                </div>

                <div v-if="step.status === 'done'">
                    • <span class="line-through decoration-2 decoration-darkred-dark">{{ step.name }}</span>
                </div>

                <div v-if="step.status === 'active'" class="">
                    • {{ step.name }}
                </div>

            </div>

        </div>

    </section>

    <section v-if="state.session.currency && !state.isLoading" class="w-96 mx-auto my-4">

        <h2 @click="
            currency_hidden = !currency_hidden;
        currency_text === 'Показати баланс'
            ? (currency_text = 'Приховати баланс')
            : (currency_text = 'Показати баланс')" class="px-4 py-2 text-center text-xl font-univers font-semibold mb-2 rounded-lg hover:cursor-pointer transition-all duration-500 
            ease-in-out select-none grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
            :class="currency_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

            <CurrencyDollarIcon class="w-8 h-8" />
            {{ currency_text }}
            <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
                :class="currency_hidden ? 'rotate-180' : 'rotate-0'" />
        </h2>

        <div v-if="!currency_hidden" v-for="value, field in state.session.currency">
            <FormAddSubtract v-if="typeof (value) === 'number'" :label="'Currency_' + field" :entity_name="field"
                v-model:value="state.session.currency[field]" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />
        </div>

    </section>

    <div v-if="!state.isLoading" class="grid grid-cols-1 justify-items-center mx-auto min-w-80 max-w-96">

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
        </div>

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

        <div class="mx-auto">

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

    </div>

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