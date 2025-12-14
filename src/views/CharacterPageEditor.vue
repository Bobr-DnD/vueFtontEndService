<script setup>
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { reactive, onMounted, ref, computed, toRaw } from 'vue';
import { useRoute } from 'vue-router';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import ObjectFieldsTable from '@/components/reusable/ObjectFieldsTable.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
import { ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid'
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import HealthFieldsEditor from '@/components/admin-page components/HealthFieldsEditor.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';
import EffectsTableEditor from '@/components/admin-page components/EffectsTableEditor.vue';
import QuestsTableEditor from '@/components/admin-page components/QuestsTableEditor.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkObjectFieldExisting } from '/utils/entityHelper';
import { toCustomFieldObjectField, toNewCharacterObject } from '/utils/objects.dto';
import { notify } from '/utils/notification';
import { checkArrayFieldExisting } from '@utils/entityHelper';

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const selected_character = ref(toNewCharacterObject({}))
const editingCharacter = ref(selected_character.value.id)

const activeTab = ref('base')
const activeInventory = ref('')

const tabs = [
    { id: 'base', label: 'Базові характеристики' },
    { id: 'custom', label: 'Кастомні поля' },
    { id: 'health', label: "Здоров'я" },
    { id: 'quests&effects', label: 'Квести та еффекти' },
    { id: 'perks', label: 'Перки&Навички' },
    { id: 'inventory', label: 'Інвентар' }
]

const inventories = [
    { id: 'weapon', label: 'Зброя', icon: BoltIcon },
    { id: 'armor', label: 'Броня', icon: ShieldCheckIcon },
    { id: 'medicine', label: 'Медикаметни', icon: BeakerIcon },
    { id: 'inventory', label: 'Інвентар', icon: ArchiveBoxIcon },
    { id: 'perk', label: 'Перки', icon: CheckBadgeIcon }
]

onMounted(async () => {
    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) {
        notify({ message: errSession.message, type: 'error' })
        return
    }

    state.isLoading = false
    state.session = resSession.data
})

function selectCharacter(character) {
    if (state.unsavedChanges) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    editingCharacter.value = character.id;
    state.unsavedChanges = false;

    if (character.id === 'empty') {
        selected_character.value = toNewCharacterObject({})
    }
    else selected_character.value = toNewCharacterObject(structuredClone(toRaw(character)))
}

function markUnsaved() {
    if (editingCharacter.value) state.unsavedChanges = true
}

async function saveCharacter() {

    if (selected_character.value.name !== '') {
        selected_character.value.session = sessionId

        if (selected_character.value.id === 'empty') {
            const [res, err] = await asyncHandler(
                RepositoryFactory.create('character', selected_character.value)
            )
            if (err) {
                notify({ message: err.message, type: 'error' })
                return
            }

            const [resSession, errSession] = await asyncHandler(
                RepositoryFactory.getById('session', sessionId)
            )
            if (errSession) {
                notify({ message: errSession.message, type: 'error' })
                return
            }

            state.session = resSession.data
            state.unsavedChanges = false

            notify({ message: 'Персонаж збережений', type: 'success' })
            selectCharacter(toNewCharacterObject(res.data))

        } else {
            const [res, err] = await asyncHandler(
                RepositoryFactory.update('character', selected_character.value.id, selected_character.value)
            )
            if (err) {
                notify({ message: err.message, type: 'error' })
                return
            }

            const [resSession, errSession] = await asyncHandler(
                RepositoryFactory.getById('session', sessionId)
            )
            if (errSession) {
                notify({ message: errSession.message, type: 'error' })
                return
            }

            state.session = resSession.data
            state.unsavedChanges = false

            notify({ message: 'Персонаж оновлений', type: 'success' })
            //selectCharacter(toNewCharacterObject(res.data))
        }
    }
    else {
        notify({ message: "У персонажа повинно бути ім'я", type: 'error' })
        return
    }
}

async function deleteCharacter() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.delete('character', selected_character.value.id)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) {
        notify({ message: errSession.message, type: 'error' })
        return
    }

    state.session = resSession.data
    state.unsavedChanges = false

    selectCharacter(toNewCharacterObject({}))
    notify({ message: 'Персонаж видалений', type: 'success' })
}

function discardChanges() {
    if (!editingCharacter.value) return
    let current;

    if (editingCharacter.value !== 'empty')
        current = state.session.characters.find(c => c.id === editingCharacter.value);
    else current = toNewCharacterObject({});

    if (current) selected_character.value = structuredClone(toRaw(current))
    state.unsavedChanges = false

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function updateCharacter(field, value) {
    selected_character.value[field] = value
    markUnsaved();
}

function updateCharacterCharacteristic(fields) {
    selected_character.characteristics = fields
    markUnsaved();
}

function updateCurrency(fields) {
    selectCharacter.currency = fields
    markUnsaved()
}

function updateCustomFields(fields) {
    selected_character.customFields = fields
    markUnsaved();
}

function addCustomField(name, value) {
    Object.assign(selected_character.value.customFields, toCustomFieldObjectField({ name, value }))
    markUnsaved();
}

function updateHealthFields(field) {
    selected_character.value.health =
        selected_character.value.health.map(h =>
            h.id === field.id ? field : h
        )

    markUnsaved();
}

function deleteHealthField(field) {
    selected_character.value.health = selected_character.value.health.filter(h => h.id !== field.id)
    markUnsaved();
}

function addHealthField(field) {
    selected_character.value.health.push(field)
    markUnsaved();
}

function updateInventory() {
    markUnsaved();
}

function updateEffects(effects) {
    selected_character.effects = effects
    markUnsaved()
}

function updateQuests(quests) {
    selected_character.quests = quests
    markUnsaved()
}

function addImage(image) {
    selected_character.value.image = image
    markUnsaved()
}

const canSave = computed(() => state.unsavedChanges && editingCharacter.value)

</script>


<template>

    <MasterPageNavigation />

    <div v-if="!state.isLoading" class="flex items-center justify-center space-x-4 m-2">
        <GraySelectorButton v-for="character in state.session.characters" :key="character.id"
            @click="selectCharacter(character)" :id="character.id" :label="character.name"
            :active="selected_character.id === character.id ? true : false" />
        <PlusButton @click="selectCharacter({ id: 'empty' })" class="w-16 h-14 border-4 border-darkred-dark rounded-lg
           md:hover:bg-darkred-gray group"
            :class="selected_character.id === 'empty' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
    </div>

    <section v-if="!state.isLoading" class="m-4 mr-8 grid grid-cols-[25%_75%] gap-2">

        <div class="p-4 w-full flex flex-col justify-start gap-2 font-gothic">
            <GraySelectorButton v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :id="tab.id"
                :label="tab.label" :active="activeTab === tab.id ? true : false" />
            <RejectButtonWithText @click="deleteCharacter" class="w-full" text="Видалити персонажа"
                v-if="selected_character.id !== 'empty'" />
            <AprroveButtonWithText @click="saveCharacter" class="w-full" text="Підтвердити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                :class="[!canSave && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="state.unsavedChanges" />
        </div>

        <div id="base" v-if="activeTab === 'base'" class="grid grid-cols-2 auto-rows-min gap-4">

            <ImageEditor class="w-full col-span-2" :image="selected_character.image" label="Character image"
                :callback="addImage" />

            <SingleFieldEditor placeholder="Ім'я(обов'язкове поле)" fieldName="name" :value="selected_character.name"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Стать" fieldName="gender" :value="selected_character.gender"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Клас" fieldName="class" :value="selected_character.class"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Раса" fieldName="race" :value="selected_character.race"
                :callback="updateCharacter" class="w-full" />

            <SingleFieldEditor placeholder="Рівень" fieldName="level" :value="selected_character.level"
                :callback="updateCharacter" type="number" class="w-full" />
            <SingleFieldEditor placeholder="Очки перків" fieldName="perkPoints" :value="selected_character.perkPoints"
                :callback="updateCharacter" type="number" class="w-full" />
            <SingleFieldEditor placeholder="Досвід" fieldName="experience" :value="selected_character.experience"
                :callback="updateCharacter" type="number" class="w-full" />
            <SingleFieldEditor placeholder="К-сть досвіду для рівня" fieldName="experienceToLevelUp"
                :value="selected_character.experienceToLevelUp" :callback="updateCharacter" type="number"
                class="w-full" />

            <TextAreaEditor fieldName="playerNotes" name="Записки гравця" :value="selected_character.playerNotes"
                :callback="updateCharacter" />
            <TextAreaEditor fieldName="adminNotes" name="Записки майстра" :value="selected_character.adminNotes"
                :callback="updateCharacter" />

            <Header1 class="col-span-2 justify-self-center" label="Список основних характеистик:" />

            <Header1 v-if="!checkArrayFieldExisting(selected_character.characteristics)" class="col-span-2"
                label="Пусто" />

            <ObjectFieldsTable v-if="checkObjectFieldExisting(selected_character.characteristics)"
                :fields="selected_character.characteristics" :callback="updateCharacterCharacteristic" />

            <Header1 class="col-span-2 justify-self-center" label="Список фінансів:" />

            <Header1 v-if="!checkArrayFieldExisting(selected_character.currency)" class="col-span-2" label="Пусто" />

            <CurrencyTable :currency_array="selected_character.currency" :callback="updateCurrency" />

        </div>

        <div id="custom" v-if="activeTab === 'custom'" class="grid grid-cols-2 auto-rows-min gap-4">

            <Header1 class="col-span-2 font-medium" label="Список кастомних полей:" />

            <Header1 v-if="!checkArrayFieldExisting(selected_character.customFields)" class="col-span-2"
                label="Пусто" />

            <ObjectFieldsTable v-if="checkObjectFieldExisting(selected_character.customFields)"
                :fields="selected_character.customFields" :callback="updateCustomFields" :field_removable="true" />

            <Header1 class="col-span-w font-medium" label="Додати нове поле:" />

            <ObjectFieldsEditor class="col-span-2" name="CustomFields_" :fields="selected_character.customFields"
                :callback="addCustomField" />

        </div>

        <div id="health" v-if="activeTab === 'health'" class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-3">


            <Header1 class="col-span-2 justify-self-center font-medium" label="Редагування існуючи полей:" />

            <Header1 v-if="!checkArrayFieldExisting(selected_character.health)" class="col-span-2" label="Пусто" />

            <HealthFieldsEditor v-for="field in selected_character.health" :key="field.id" :label="field.name"
                :health_field="field" class="col-span-2" :callback="updateHealthFields"
                :callback_remove="deleteHealthField" />

            <Header1 class="col-span-2 justify-self-center font-medium" label="Створити нове поле::" />

            <HealthFieldsEditor label="Health" class="col-span-2" :callback="addHealthField" />

        </div>

        <div id="quests&effects" v-if="activeTab === 'quests&effects'"
            class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-3">

            <Header1 class="justify-self-center" label="Еффекти:" />
            <Header1 class="justify-self-center" label="Квести:" />

            <EffectsTableEditor :sessionEffects="state.session.effects" :character_effects="selected_character.effects"
                :callback="updateEffects" />

            <QuestsTableEditor class="flex flex-col gap-2" :session_quests="state.session.quests"
                :character_quests="selected_character.quests" :callback="updateQuests" />
        </div>

        <div id="perks" v-if="activeTab === 'perks'" class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-3">

        </div>

        <div id="inventory" v-if="activeTab === 'inventory'" class="flex flex-col items-center gap-y-4">

        </div>

    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>