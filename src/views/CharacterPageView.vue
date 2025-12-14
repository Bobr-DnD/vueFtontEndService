<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { ChartBarIcon, SparklesIcon, FlagIcon, BanknotesIcon } from '@heroicons/vue/24/solid'

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkArrayFieldExisting } from '/utils/entityHelper'
import { toCustomFieldObjectField } from '/utils/objects.dto';
import { toNewCharacterObject } from '/utils/objects.dto';
import { socket } from '@ws/webSocket';
import { notify } from '/utils/notification';

import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import PerkTable from '@/components/character-page components/PerkTable.vue';
import EntityTable from '@/components/character-page components/EntityTable.vue';
import EffectsTable from '@/components/character-page components/EffectsTable.vue';
import QuestsTable from '@/components/character-page components/QuestsTable.vue';
import ObjectFieldsTable from '@/components/reusable/ObjectFieldsTable.vue';
import characterCardSmall from '@/components/character-page components/CharacterViewCard.vue';
import Experience from '@/components/character-page components/Experience.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';
import ButtonRedHideFunction from '@/components/reusable/Buttons/ButtonRedHideFunction.vue';
import HideButton from '@/components/reusable/Buttons/HideButton.vue';
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';

import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true
})

let effects_hidden = ref(true)
let quests_hidden = ref(true)
let currency_hidden = ref(true)
let custom_hidden = ref(true)
let custom_modal_hidden = ref(true)
let perks_hidden = ref(true)

const characterId = useRoute().params.characterId
const sessionId = useRoute().params.sessionId

socket.on('session:join', (session) => {
    if (session?.members?.some(member => member[0] === socket.id)) return
    socket.emit('session:connectCharacter', sessionId, { characterId })
})

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

    state.character = toNewCharacterObject(resCharacter.data)
    state.session = resSession.data
    socket.emit('session:connectCharacter', sessionId, { characterId })
})

onBeforeUnmount(() => {
    socket.emit('session:disconnectCharacter', sessionId)
    socket.off('session:join')
})

state.character.perks !== undefined ? perks_hidden.value = false : perks_hidden.value = true

async function updateCharacter() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.update('character', characterId, state.character)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }
    return toNewCharacterObject(res.data)
}

async function updateSession() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.update('session', sessionId, state.session)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
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

async function updateHealthFields(value, title) {
    const item = state.character.health.find(h => h.name === title)
    if (item) {
        item.value += value
    }
    state.character = await updateCharacter() //TODO refactor update to dto
}

function updateCurrency(fields) {
    state.character.currency = fields
    markUnsaved()
}

async function addCustomField(name, value) {
    Object.assign(state.character.customFields, toCustomFieldObjectField({ name, value }))
    state.character = await updateCharacter()
}

async function updateCustomFields(fields) {
    state.character.customFields = fields
    state.character = await updateCharacter()
}

async function updateEntities() {
    state.character = await updateCharacter()
}

async function addPerk() {
    state.character.perkPoints--;
    state.character = await updateCharacter()
}

async function updateCharacterNotes(field, value) {
    state.character[field] = value;
    state.character = await updateCharacter()
}

</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="w-80 mx-auto my-6 space-y-2 font-univers">

        <characterCardSmall :name="state.character.name" :characteristics="state.character.characteristics"
            :gender="state.character.gender" :class="state.character.class" :race="state.character.race"
            :image="state.character.image" />

        <Experience :exp="state.character.experience" :expMax="state.character.experienceToLevelUp"
            :perkPoints="state.character.perkPoints" :callback="addExperience" />

    </div>

    <div v-if="!state.isLoading" class="w-96 mx-auto my-4">

        <section class="mb-2" v-for="h in state.character.health" :key="h.id">

            <div class="p-1 grow">
                <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
            </div>

            <HorizontalNumberPicker :value="h.value" :min="-h.value" :max="h.max - h.value" :colors="h.colors"
                :callback="updateHealthFields" :title="h.name" />

        </section>

        <section class="grid grid-cols-1 gap-2 w-full mx-auto my-2">


            <div class="flex flex-col gap-2">
                <HideButton v-if="checkArrayFieldExisting(state.character.effects)" class="w-full"
                    textShow="Показати ефекти" textHide="Приховати ефекти" :hidden="effects_hidden"
                    :mainIcon="SparklesIcon" @click="effects_hidden = !effects_hidden" />
                <EffectsTable v-if="checkArrayFieldExisting(state.character.effects) && !effects_hidden"
                    :effects="state.character.effects" />
            </div>

            <div class="flex flex-col gap-2">
                <HideButton v-if="checkArrayFieldExisting(state.character.quests)" class="w-full"
                    textShow="Показати квести" textHide="Приховати квести" :hidden="quests_hidden" :mainIcon="FlagIcon"
                    @click="quests_hidden = !quests_hidden" />
                <QuestsTable v-if="checkArrayFieldExisting(state.character.quests) && !quests_hidden"
                    :quests="state.character.quests" />
            </div>


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


        </section>
    </div>

    <section v-if="!state.isLoading" class="grid grid-cols-1 gap-2 justify-items-center mx-auto min-w-80 max-w-96">

        <!-- <section class="w-full">
            <ButtonRedHideFunction @click="perks_hidden = !perks_hidden" text="Навички" mainIcon="checkBadge"
                :hidden="perks_hidden" />
            <div :class="['grid gird-cols-1 w-full', perks_hidden ? 'hidden' : '']">
                <PerkTable v-if="state.session.perks" :session_perks="state.session.perks"
                    :character_perks="state.character.perks" :perkPoints="state.character.perkPoints"
                    :callback="addPerk" :removable="false" />
            </div>
        </section> -->

        <section class="w-full flex flex-col gap-1">
            <PerkTable :session_perks="state.session.perks" :character_perks="state.character.perks"
                :perkPoints="state.character.perkPoints" :callback="addPerk" />
        </section>

        <section class="w-full flex flex-col gap-1">
            <EntityTable :character_entities="state.character.entities" :session_entities="state.session.entities"
                :types="state.session.entityTypes" :callback="updateEntities" />
        </section>

    </section>

    <section v-if="!state.isLoading" class="mx-auto min-w-80 max-w-96">
        <TextAreaEditor fieldName="playerNotes" name="Записки гравця" :value="state.character.playerNotes"
            :callback="updateCharacterNotes" />
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