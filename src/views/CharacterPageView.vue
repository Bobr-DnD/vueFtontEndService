<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { CheckBadgeIcon, ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon, ChartBarIcon, SparklesIcon, FlagIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid'

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkArrayFieldExisting, checkObjectFieldExisting } from '/utils/entityHelper'
import { toCustomFieldObjectField } from '/utils/objects.dto';

import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import WeaponRow from '@/components/character-page components/WeaponRow.vue';
import ArmorRow from '@/components/character-page components/ArmorRow.vue';
import MedsRow from '@/components/character-page components/MedsRow.vue';
import InventoryRow from '@/components/character-page components/InventoryRow.vue';
import PerkRow from '@/components/character-page components/PerkRow.vue';

import EffectsTable from '@/components/character-page components/EffectsTable.vue';
import QuestsTable from '@/components/character-page components/QuestsTable.vue';
import CustomFieldsTable from '@/components/reusable/CustomFieldsTable.vue';
import characterCardSmall from '@/components/character-page components/CharacterViewCard.vue';
import Experience from '@/components/character-page components/Experience.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';
import ButtonRedHideFunction from '@/components/reusable/Buttons/ButtonRedHideFunction.vue';
import HideButton from '@/components/reusable/Buttons/HideButton.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';

import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

const state = reactive({
    character: {},
    session: {},
    isLoading: true,
    connected: false
})

let effects_hidden = ref(true)
let quests_hidden = ref(true)
let currency_hidden = ref(true)
let custom_hidden = ref(true)
let custom_modal_hidden = ref(true)
let perks_hidden = ref(Boolean)
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
})

state.character.perks !== undefined ? perks_hidden.value = false : perks_hidden.value = true



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

async function updateHealthFields(value, title) {
    const item = state.character.health.find(h => h.name === title)
    if (item) {
        item.value += value
    }
    state.character = await updateCharacter() //TODO refactor update to dto
}

async function updateCurrency(currency) {
    state.session.currency = currency
    state.session = await updateSession()
}

async function addCustomField(name, value) {
    Object.assign(state.character.customFields, toCustomFieldObjectField({ name, value }))
    state.character = await updateCharacter()
}

async function updateCustomFields(fields) {
    state.character.customFields = fields
    state.character = await updateCharacter()
}

async function updateInventory() {
    state.character = await updateCharacter()
}

async function addPerk(){
    state.character.perkPoints--;
    state.character = await updateCharacter()
}

async function updateCharacterNotes(field, value){
    state.character[field] = value;
    state.character = await updateCharacter()
}

</script>

<template>
    <SessionViewNavigtaion />

    <div v-if="!state.isLoading" class="w-80 mx-auto my-6 space-y-2 font-univers">

        <characterCardSmall :name="state.character.name" :characteristics="state.character.characteristics"
            :gender="state.character.gender" :class="state.character.class" :race="state.character.race" />

        <Experience :exp="state.character.experience" :expMax="state.character.experienceToLevelUp"
            :perkPoints="state.character.perkPoints" :callback="addExperience" />

    </div>

    <div v-if="!state.isLoading" class="w-96 mx-auto my-4">

        <section class="mb-2" v-for="h in state.character.health">

            <div class="p-1 grow">
                <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
            </div>

            <HorizontalNumberPicker :value="h.value" :min="-h.value" :max="h.max - h.value" :colors="h.colors"
                :callback="updateHealthFields" :title="h.name" />

        </section>

        <section class="grid grid-cols-1 gap-2 w-full mx-auto my-2">


            <div class="">
                <HideButton v-if="checkArrayFieldExisting(state.character.effects)" class="w-full mb-2"
                    textShow="Показати ефекти" textHide="Приховати ефекти" :hidden="effects_hidden"
                    :mainIcon="SparklesIcon" @click="effects_hidden = !effects_hidden" />
                <EffectsTable v-if="checkArrayFieldExisting(state.character.effects) && !effects_hidden"
                    :effects="state.character.effects" />
            </div>

            <div class="">
                <HideButton v-if="checkObjectFieldExisting(state.character.quest)" class="w-full"
                    textShow="Показати особистий квест" textHide="Приховати особистий квест" :hidden="quests_hidden"
                    :mainIcon="FlagIcon" @click="quests_hidden = !quests_hidden" />
                <QuestsTable v-if="checkObjectFieldExisting(state.character.quest) && !quests_hidden"
                    :quests="state.character.quests" />
            </div>


            <div class="">
                <HideButton v-if="checkObjectFieldExisting(state.character.customFields)" class="w-full"
                    textShow="Показати додаткові характеристики" textHide="Приховати додаткові характеристики"
                    :hidden="custom_hidden" :mainIcon="ChartBarIcon" @click="custom_hidden = !custom_hidden" />

                <CustomFieldsTable v-if="checkObjectFieldExisting(state.character.customFields) && !custom_hidden"
                    :fields="state.character.customFields" :callback="updateCustomFields" />

                <PlusButton v-if="checkObjectFieldExisting(state.character.customFields) && !custom_hidden" @click="custom_modal_hidden = !custom_modal_hidden" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg 
           transition-all duration-300 ease-out hover:cursor-pointer
           bg-gradient-to-br from-darkred-dark to-darkred-light
           hover:from-darkred-red hover:to-darkred-dark relative overflow-hidden group" />

                <ObjectFieldsEditor v-if="!custom_modal_hidden && !custom_hidden" :name="'CustomFields_'"
                    :fields="state.character.customFields" :callback="addCustomField" />

            </div>

            <div class="">
                <HideButton v-if="checkObjectFieldExisting(state.session.currency)" class="w-full"
                    textShow="Показати баланс" textHide="Приховати баланс" :hidden="currency_hidden"
                    :mainIcon="CurrencyDollarIcon" @click="currency_hidden = !currency_hidden" />
                <CurrencyTable v-if="checkObjectFieldExisting(state.session.currency) && !currency_hidden"
                    :currency="state.session.currency" :callback="updateCurrency" />
            </div>


        </section>
    </div>

    <section v-if="!state.isLoading" class="grid grid-cols-1 justify-items-center mx-auto min-w-80 max-w-96">

        <section>
            <ButtonRedHideFunction @click="perks_hidden = !perks_hidden"  text="Навички" :mainIcon="CheckBadgeIcon" :hidden="perks_hidden" />
            <div :class="['grid grid-cols-1 w-full', perks_hidden ? 'hidden' : '']">
                <PerkRow v-if="state.session.perks" :perks_all="state.session.perks" 
                    :perks="state.character.perks" :perkPoints="state.character.perkPoints" :callback="addPerk" />
            </div>
        </section>

        <section>
            <ButtonRedHideFunction @click="weapons_hidden = !weapons_hidden" text="Зброя" :mainIcon="BoltIcon" :hidden="weapons_hidden" />
            <div :class="['grid grid-cols-1 w-full', weapons_hidden ? 'hidden' : '']">
                <WeaponRow :weapons_all="state.session.weapons" :weapons="state.character.weapons"
                    :callback="updateInventory" />
            </div>
        </section>

        <section>
            <ButtonRedHideFunction @click="armors_hidden = !armors_hidden" text="Броня" :mainIcon="ShieldCheckIcon" :hidden="armors_hidden" />
            <div :class="['grid grid-cols-1 w-full', armors_hidden ? 'hidden' : '']">
                <ArmorRow :armors_all="state.session.armors" :armors="state.character.armor"
                    :callback="updateInventory" />
            </div>
        </section>

        <section>
            <ButtonRedHideFunction @click="meds_hidden = !meds_hidden" text="Медикаменти" :mainIcon="BeakerIcon" :hidden="meds_hidden" />
            <div :class="['grid grid-cols-1 w-full', meds_hidden ? 'hidden' : '']">
                <MedsRow :medicines_all="state.session.medicines" :medicines="state.character.medicines"
                    :effects_all="state.session.effects" :effects="state.character.effects" :move="state.session.move"
                    :callback="updateInventory" />
            </div>
        </section>

        <section>
            <ButtonRedHideFunction @click="inventories_hidden = !inventories_hidden" text="Інвентар" :mainIcon="ArchiveBoxIcon" v-model:hidden="inventories_hidden" />
            <div :class="['grid grid-cols-1 w-full', inventories_hidden ? 'hidden' : '']">
                <InventoryRow :inventory_all="state.session.inventories" :inventory="state.character.inventory"
                    :callback="updateInventory" />
            </div>
        </section>


    </section>

    <section class="mx-auto min-w-80 max-w-96">
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