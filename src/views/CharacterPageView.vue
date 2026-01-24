<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, watch, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { ChartBarIcon, SparklesIcon, FlagIcon, BanknotesIcon } from '@heroicons/vue/24/solid'

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkArrayFieldExisting } from '/utils/entityHelper'
import { toObject } from '/utils/objects.dto';
import { toNewCharacterObject, toNewSession } from '/utils/objects.dto';
import { socket, connected } from '@ws/webSocket';
import { notify } from '@utils/notification';

import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import PerkTable from '@/components/character-page components/PerkTable.vue';
import EntityTable from '@/components/character-page components/EntityTable.vue';
import EffectsTable from '@/components/character-page components/EffectsTable.vue';
import QuestsTable from '@/components/character-page components/QuestsTable.vue';
import ObjectFieldsTable from '@/components/reusable/ObjectFieldsTable.vue';
import characterCardSmall from '@/components/character-page components/CharacterViewCard.vue';
import Experience from '@/components/character-page components/Experience.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';
import HideButton from '@/components/reusable/Buttons/HideButton.vue';
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import BackendOffline from '@/components/reusable/BackendOffline.vue';
import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';
import DiceLoader from '@/components/reusable/Loaders/DiceLoader.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true,
})

const effects_hidden = ref(true)
const quests_hidden = ref(true)
const currency_hidden = ref(true)
const custom_hidden = ref(true)
const custom_modal_hidden = ref(true)
const isBackendOffline = ref(false)
const offlineTimeout = ref(null)


const characterId = useRoute().params.characterId
const sessionId = useRoute().params.sessionId

onMounted(async () => {
    const [resCharacter, errCharacter] = await asyncHandler(
        RepositoryFactory.getById('character', characterId)
    )
    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )

    if (errCharacter) return
    if (errSession) return

    state.character = toNewCharacterObject(resCharacter.data)
    state.session = toNewSession(resSession.data)

    socket.emit('session:connectCharacter', sessionId, characterId)
    state.isLoading = false
})

onBeforeUnmount(() => {
    socket.emit('session:disconnectCharacter', sessionId)
    const events = ['session:join', 'character:update', 'character:updateAdmin', 'character:get', 'session:updateEverywhere']
    events.forEach(e => socket.off(e))
})

socket.on('session:join', (session) => {
    if (session?.members?.some(member => member[0] === socket.id)) return
    socket.emit('session:connectCharacter', sessionId, characterId)
    state.isLoading = false
})

socket.on('character:get', (character) => {
    state.character = toNewCharacterObject(character)
})

socket.on('character:update', (character) => {
    state.character = toNewCharacterObject(character)
})

socket.on('character:updateAdmin', (character) => {
    state.character = toNewCharacterObject(character)
    notify({ message: 'Майстер оновив персонажа', type: 'warning' })
})

socket.on('session:updateEverywhere', (session) => {
    state.session = toNewSession(session)
    socket.emit('character:get', characterId)
    notify({ message: 'Майстер оновив сесію', type: 'warning' })
})

watch(connected, (isConnected) => {
    if (isConnected) {
        if (offlineTimeout.value) {
            clearTimeout(offlineTimeout.value)
            offlineTimeout.value = null
        }
        isBackendOffline.value = false
        state.isLoading = false
    }
    else {
        if (!isBackendOffline.value) {
            offlineTimeout.value = setTimeout(() => {

                isBackendOffline.value = true
            }, 30 * 1000)
        }
        state.isLoading = true
    }
})

function updateCharacter() {
    socket.emit('character:update', (toRaw(state.character)))
}

function addExperience() {
    state.character.experience++;
    if (state.character.experience >= state.character.experienceToLevelUp) {
        state.character.experience = 0;
        state.character.perkPoints++;
        state.character.level++;
    }
    updateCharacter()
}

function updateHealthFields(value, title) {
    const item = state.character.health.find(h => h.name === title)
    if (item) {
        item.value += value
    }
    updateCharacter()
}

function updateCurrency(fields) {
    state.character.currency = fields
    updateCharacter()
}

function addCustomField(name, value) {
    Object.assign(state.character.customFields, toObject({ name, value }))
    updateCharacter()
    custom_modal_hidden.value = true
}

function updateCustomFields(fields) {
    state.character.customFields = fields
    updateCharacter()
}

function addPerk() {
    state.character.perkPoints--;
    updateCharacter()
}

function updateCharacterNotes(field, value) {
    state.character[field] = value;
    updateCharacter()
}

</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="grid grid-cols-1 lg:grid-cols-[25%_75%]">

        <section class="p-2 lg:p-4 space-y-2">

            <characterCardSmall :name="state.character.name" :characteristics="state.character.characteristics"
                :gender="state.character.gender" :class="state.character.class" :race="state.character.race"
                :image="state.character.image" />

            <Experience :exp="state.character.experience" :expMax="state.character.experienceToLevelUp"
                :perkPoints="state.character.perkPoints" :callback="addExperience" />

            <TextAreaEditor class="lg:grid hidden" fieldName="playerNotes" name="Записки гравця"
                :value="state.character.playerNotes" :callback="updateCharacterNotes" />
        </section>

        <section class="p-2 lg:p-4 space-y-2">

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">

                <div v-for="h in state.character.health" :key="h.id">

                    <div class=" p-1 grow">
                        <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
                    </div>

                    <HorizontalNumberPicker :value="h.value" :min="-h.value" :max="h.max - h.value" :colors="h.colors"
                        :callback="updateHealthFields" :title="h.name" />
                </div>

            </section>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2">

                <div class="flex flex-col gap-2">
                    <HideButton class="w-full" textShow="Показати додаткові характеристики"
                        textHide="Приховати додаткові характеристики" :hidden="custom_hidden" :mainIcon="ChartBarIcon"
                        @click="custom_hidden = !custom_hidden" />

                    <ObjectFieldsTable v-if="!custom_hidden" :fields="state.character.customFields"
                        :callback="updateCustomFields" :field_removable="false" />

                    <PlusButton v-if="!custom_hidden" @click="custom_modal_hidden = !custom_modal_hidden" class="w-16 h-14 mt-2 mx-auto text-center border-4 border-darkred-dark rounded-lg 
           transition-all duration-300 ease-out md:hover:cursor-pointer
           bg-gradient-to-br from-darkred-dark to-darkred-light
           md:hover:from-darkred-red md:hover:to-darkred-dark relative overflow-hidden group" />

                    <div @click="custom_modal_hidden = true" v-if="!custom_modal_hidden && !custom_hidden"
                        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">

                        <div @click.stop
                            class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl bg-darkred-dark relative">
                            <div class="">
                                <CloseButtonRedBG @click="custom_modal_hidden = true" />
                            </div>

                            <ObjectFieldsEditor class="hover:cursor-default" :name="'CustomFields_'"
                                :fields="state.character.customFields" :callback="addCustomField" />

                        </div>

                    </div>

                </div>

                <div class="flex flex-col gap-2">
                    <HideButton v-if="checkArrayFieldExisting(state.character.currency)" class="w-full"
                        textShow="Показати баланс" textHide="Приховати баланс" :hidden="currency_hidden"
                        :mainIcon="BanknotesIcon" @click="currency_hidden = !currency_hidden" />
                    <CurrencyTable v-if="!currency_hidden" :currency_array="state.character.currency"
                        :callback="updateCurrency" />
                </div>

                <div class="flex flex-col gap-2">
                    <HideButton v-if="checkArrayFieldExisting(state.character.effects)" class="w-full"
                        textShow="Показати ефекти" textHide="Приховати ефекти" :hidden="effects_hidden"
                        :mainIcon="SparklesIcon" @click="effects_hidden = !effects_hidden" />
                    <EffectsTable v-if="checkArrayFieldExisting(state.character.effects) && !effects_hidden"
                        :effects="state.character.effects" />
                </div>

                <div class="flex flex-col gap-2">
                    <HideButton v-if="checkArrayFieldExisting(state.character.quests)" class="w-full"
                        textShow="Показати квести" textHide="Приховати квести" :hidden="quests_hidden"
                        :mainIcon="FlagIcon" @click="quests_hidden = !quests_hidden" />
                    <QuestsTable v-if="checkArrayFieldExisting(state.character.quests) && !quests_hidden"
                        :quests="state.character.quests" />
                </div>

            </section>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
                <PerkTable :session_perks="state.session.perks" :character_perks="state.character.perks"
                    :perkPoints="state.character.perkPoints" :callback="addPerk" />

                <EntityTable :character_entities="state.character.entities" :session_entities="state.session.entities"
                    :types="state.session.entityTypes" :callback="updateCharacter" />
            </section>

            <section>
                <TextAreaEditor class="lg:hidden" fieldName="playerNotes" name="Записки гравця"
                    :value="state.character.playerNotes" :callback="updateCharacterNotes" />
            </section>

        </section>
    </div>

    <div v-if="state.isLoading" class="w-full h-full text-center py-6 flex flex-col gap-10 justify-center items-center">
        <BackendOffline v-if="isBackendOffline" class="p-4 w-full lg:w-[650px]" />

        <DiceLoader />
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