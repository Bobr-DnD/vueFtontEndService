<script setup>
import { reactive, onBeforeUnmount, watch, toRaw, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChartBarIcon, SparklesIcon, BanknotesIcon } from '@heroicons/vue/24/solid'

import { checkObjectFieldExisting } from '/utils/entityHelper'
import { toNewCharacterObject } from '/utils/objects.dto';
import { socket } from '@ws/webSocket';
import { useSessionStore } from '@/stores/sessionStore';
import { useGameStore } from '@/stores/gameStore';

import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import PerkTable from '@/components/character-page components/PerkTable.vue';
import EntityTable from '@/components/character-page components/EntityTable.vue';
import EffectsTable from '@/components/character-page components/EffectsTable.vue';
import CustomFieldTile from '@/components/reusable/EntityTiles/CustomFieldTile.vue';
import characterCardSmall from '@/components/character-page components/CharacterViewCard.vue';
import Experience from '@/components/character-page components/Experience.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';
import HideButton from '@/components/reusable/Buttons/HideButton.vue';
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import CustomFieldsEditor from '@/components/reusable/CustomFieldsEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import BackendOffline from '@/components/reusable/BackendOffline.vue';
import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';
import DiceLoader from '@/components/reusable/Loaders/DiceLoader.vue';
import { CursorArrowRippleIcon } from '@heroicons/vue/24/outline';

const state = reactive({
    character: {},
    characterIsUpdating: false,
})

const route = useRoute()
const characterId = computed(() => route.params.characterId)
const sessionId = computed(() => route.params.sessionId)
const sessionStore = useSessionStore()
const gameStore = useGameStore()

const effects_hidden = computed({
    get: () => gameStore.effects_hidden[characterId.value],
    set: (val) => { gameStore.effects_hidden[characterId.value] = val }
})
const currency_hidden = computed({
    get: () => gameStore.currency_hidden[characterId.value],
    set: (val) => { gameStore.currency_hidden[characterId.value] = val }
})
const custom_hidden = computed({
    get: () => gameStore.custom_hidden[characterId.value],
    set: (val) => { gameStore.custom_hidden[characterId.value] = val }
})
const custom_modal_hidden = computed({
    get: () => gameStore.custom_modal_hidden[characterId.value],
    set: (val) => { gameStore.custom_modal_hidden[characterId.value] = val }
})
const openHealthIds = computed(() => gameStore.openHealthIds[characterId.value])

watch(
    () => sessionStore.isLoading,
    (isLoading) => {
        if (isLoading) return
        init()
    },
    { immediate: true }
)

function init() {
    state.character = toNewCharacterObject(structuredClone(toRaw(sessionStore.session.characters.find(el => el.id === characterId.value))))
    socket.emit('session:connectCharacter', sessionId.value, characterId.value)
}

watch(
    () => sessionStore.session,
    (newSession) => {
        if (sessionStore.isLoading || !newSession) return
        const updated = newSession.characters.find(el => el.id === characterId.value)
        if (updated) state.character = toNewCharacterObject(structuredClone(toRaw(updated)))
    }
)

onBeforeUnmount(() => {
    socket.emit('session:disconnectCharacter', sessionId.value)
    const events = ['session:join', 'character:updateDataNotify']
    events.forEach(e => socket.off(e))
})

socket.on('session:join', (session) => {
    if (session?.members?.some(member => member[0] === socket.id)) return
    socket.emit('session:connectCharacter', sessionId.value, characterId.value)
})

socket.on('character:updateDataNotify', (character) => {
    state.character = toNewCharacterObject(character)
    state.characterIsUpdating = false
})

function updateCharacter() {
    socket.emit('character:updateData', state.character)
    state.characterIsUpdating = true
}

// character functions

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
    gameStore.openHealthIds[characterId.value].delete(item.id)
    updateCharacter()
}

function updateCurrency(fields) {
    state.character.currency = fields
    updateCharacter()
}

function addCustomField(object) {
    state.character.customFields.push(object)
    custom_modal_hidden.value = true
    updateCharacter()
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

function togglePicker(healthId) {
    gameStore.toggleHealthId(characterId.value, healthId)
    updateCharacter()
}

</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!sessionStore.isLoading" class="grid grid-cols-1 lg:grid-cols-[25%_75%]">

        <section class="p-2 lg:p-4 space-y-2">

            <characterCardSmall :name="state.character.name" :characteristics="state.character.characteristics"
                :effects="state.character.effects" :gender="state.character.gender" :class="state.character.class"
                :race="state.character.race" :image="state.character.image" />

            <Experience :exp="state.character.experience" :expMax="state.character.experienceToLevelUp"
                :perkPoints="state.character.perkPoints" :level="state.character.level" :callback="addExperience"
                :class="state.characterIsUpdating && 'pointer-events-none'" />

            <TextAreaEditor class="lg:grid hidden" fieldName="playerNotes" name="Записки гравця"
                :value="state.character.playerNotes" :callback="updateCharacterNotes" />
        </section>

        <section class="p-2 lg:p-4 space-y-2">

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">

                <div v-for="h in state.character.health" :key="h.id">

                    <div class=" p-1 grow cursor-pointer relative">
                        <CursorArrowRippleIcon class="w-5 h-5 absolute top-2 right-2 text-darkred-dark" />
                        <ProgressiveBar @click="togglePicker(h.id)" :value="h.value" :valueMax="h.max" :text="h.name"
                            :colors="h.colors" />
                    </div>

                    <Transition name="slide">
                        <div v-if="openHealthIds.has(h.id)">
                            <HorizontalNumberPicker :value="h.value" :min="-h.value" :max="h.max - h.value"
                                :colors="h.colors" :callback="updateHealthFields" :title="h.name" />
                        </div>
                    </Transition>

                </div>

            </section>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2">

                <div class="flex flex-col gap-2 lg:col-span-full">
                    <HideButton class="w-full" textShow="Показати додаткові характеристики"
                        textHide="Приховати додаткові характеристики" :hidden="custom_hidden" :mainIcon="ChartBarIcon"
                        @click="custom_hidden = !custom_hidden" />

                    <div class="grid transition-all duration-300 ease-in-out"
                        :style="{ gridTemplateRows: custom_hidden ? '0fr' : '1fr' }">
                        <div class="overflow-hidden flex flex-col lg:grid lg:grid-cols-2  gap-2">
                            <CustomFieldTile :fields="state.character.customFields"
                                @update:fields="updateCustomFields" />

                            <PlusButton @click="custom_modal_hidden = !custom_modal_hidden" class="w-16 h-14 col-span-full mt-2 mx-auto text-center border-4 border-darkred-dark rounded-lg 
           transition-all duration-300 ease-out md:hover:cursor-pointer
           bg-gradient-to-br from-darkred-dark to-darkred-light
           md:hover:from-darkred-red md:hover:to-darkred-dark relative overflow-hidden group" />
                        </div>
                    </div>

                    <div @click="custom_modal_hidden = true" v-if="!custom_modal_hidden && !custom_hidden"
                        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">

                        <div @click.stop
                            class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl bg-darkred-dark relative">
                            <div>
                                <CloseButtonRedBG @click="custom_modal_hidden = true" />
                            </div>

                            <CustomFieldsEditor class="hover:cursor-default" :name="'CustomFields_'"
                                :callback="addCustomField" />
                        </div>
                    </div>
                </div>

                <div v-if="checkObjectFieldExisting(state.character?.effects)" class="flex flex-col gap-2">
                    <HideButton class="w-full" textShow="Показати ефекти" textHide="Приховати ефекти"
                        :hidden="effects_hidden" :mainIcon="SparklesIcon" @click="effects_hidden = !effects_hidden" />

                    <div class="grid transition-all duration-300 ease-in-out"
                        :style="{ gridTemplateRows: effects_hidden ? '0fr' : '1fr' }">
                        <div class="overflow-hidden">
                            <EffectsTable :effects="state.character.effects" />
                        </div>
                    </div>

                </div>

                <div v-if="checkObjectFieldExisting(state.character?.currency)" class="flex flex-col gap-2">
                    <HideButton class="w-full" textShow="Показати баланс" textHide="Приховати баланс"
                        :hidden="currency_hidden" :mainIcon="BanknotesIcon"
                        @click="currency_hidden = !currency_hidden" />

                    <div class="grid transition-all duration-300 ease-in-out"
                        :style="{ gridTemplateRows: currency_hidden ? '0fr' : '1fr' }">
                        <div class="overflow-hidden">
                            <CurrencyTable :currency_array="state.character.currency" :callback="updateCurrency" />
                        </div>
                    </div>

                </div>

            </section>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
                <PerkTable :session_perks="sessionStore.session.perks" :character_perks="state.character.perks"
                    :perkPoints="state.character.perkPoints" :callback="addPerk" />

                <EntityTable :character_entities="state.character.entities"
                    :session_entities="sessionStore.session.entities" :types="sessionStore.session.entityTypes"
                    :callback="updateCharacter" />
            </section>

            <section>
                <TextAreaEditor class="lg:hidden" fieldName="playerNotes" name="Записки гравця"
                    :value="state.character.playerNotes" :callback="updateCharacterNotes" />
            </section>

        </section>
    </div>

    <div v-if="sessionStore.isLoading || gameStore.isBackendOffline"
        class="w-full h-full text-center py-6 flex flex-col gap-10 justify-center items-center">
        <BackendOffline v-if="gameStore.isBackendOffline" class="p-4 w-full lg:w-[650px]" />

        <DiceLoader />
    </div>

</template>

<style scoped>
.slide-enter-active {
    transition: all 0.3s ease-out;
}

.slide-leave-active {
    transition: all 0.2s ease-in;
}

.slide-enter-from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}

.slide-enter-to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
}

.slide-leave-from {
    opacity: 1;
    max-height: 500px;
}

.slide-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}
</style>