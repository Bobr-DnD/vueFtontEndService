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
import CustomFieldsTable from '@/components/reusable/CustomFieldsTable.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';
import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import { ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon, CheckBadgeIcon, ChartBarSquareIcon } from '@heroicons/vue/24/solid'
import WeaponRow from '@/components/character-page components/WeaponRow.vue';
import ArmorRow from '@/components/character-page components/ArmorRow.vue';
import MedsRow from '@/components/character-page components/MedsRow.vue';
import InventoryRow from '@/components/character-page components/InventoryRow.vue';
import PerkRow from '@/components/character-page components/PerkRow.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import HealthFieldsEditor from '@/components/admin-page components/HealthFieldsEditor.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkObjectFieldExisting } from '/utils/entityHelper';
import { toCustomFieldObjectField, toEmptyCharacterObject } from '/utils/objects.dto';
import { notify } from '/utils/notification';

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const selected_character = ref(toEmptyCharacterObject({}))
const editingCharacter = ref(selected_character.value.id)

const activeTab = ref('base')
const activeInventory = ref('')

const tabs = [
    { id: 'base', label: 'Базові характеристики' },
    { id: 'main', label: 'Головні характеристики' },
    { id: 'health', label: "Здоров'я" },
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
        console.warn(errSession.message)
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
        selected_character.value = toEmptyCharacterObject({})
    }
    else selected_character.value = structuredClone(toRaw(character))
}

function markUnsaved() {
    if (editingCharacter.value) state.unsavedChanges = true
}

async function saveCharacter() {

    if (selected_character.value.name !== '') {
        if (selected_character.value.id === 'empty') {
            console.log('Creating character:', selected_character.value)
            // const [res, err] = await asyncHandler(
            //     RepositoryFactory.create('character', selected_character.value)
            // )
            notify({ message: 'Персонаж збережений', type: 'success' })
        } else {
            console.log('Saving changes for:', selected_character.value)
            // const [res, err] = await asyncHandler(
            //     RepositoryFactory.update('character', selected_character.value.id, selected_character.value)
            // )
            notify({ message: 'Персонаж оновлений', type: 'success' })

        }
        state.unsavedChanges = false
    }
    else notify({ message: "У персонажа повинно бути ім'я", type: 'error' })

}

function discardChanges() {
    if (!editingCharacter.value) return
    let current;

    if (editingCharacter.value !== 'empty')
        current = state.session.characters.find(c => c.id === editingCharacter.value);
    else current = toEmptyCharacterObject({});

    if (current) selected_character.value = structuredClone(toRaw(current))
    state.unsavedChanges = false

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

async function updateCharacter(field, value) {
    selected_character.value[field] = value
    markUnsaved();
}

async function updateCharacterCharacteristic(fields) {
    selected_character.characteristics = fields
    markUnsaved();
}

async function addCharacterCharacteristic(name, value) {
    Object.assign(selected_character.value.characteristics, toCustomFieldObjectField({ name, value }))
    markUnsaved();
}

async function updateCustomFields(fields) {
    selected_character.customFields = fields
    markUnsaved();
}

async function addCustomField(name, value) {
    Object.assign(selected_character.value.customFields, toCustomFieldObjectField({ name, value }))
    markUnsaved();
}

async function updateHealthFields(value, title) {
    const item = selected_character.value.health.find(h => h.name === title)
    if (item) {
        item.value += value
    }
    markUnsaved();
}

async function addHealthField(field) {
    selected_character.value.health.push(field)
    markUnsaved();
}

async function updateInventory() {
    markUnsaved();
}

const canSave = computed(() => state.unsavedChanges && editingCharacter.value)

</script>


<template>

    <MasterPageNavigation />

    <div v-if="!state.isLoading" class="flex items-center justify-center space-x-4 m-2">
        <GraySelectorButton v-for="character in state.session.characters" @click="selectCharacter(character)"
            :id="character.id" :label="character.name"
            :active="selected_character.id === character.id ? true : false" />
        <PlusButton @click="selectCharacter({ id: 'empty' })" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg md:hover:cursor-pointer
           md:hover:bg-darkred-gray relative overflow-hidden group"
            :class="selected_character.id === 'empty' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
    </div>

    <section v-if="!state.isLoading" class="m-4 mr-8 grid grid-cols-[25%_75%] gap-2">

        <div class="p-4 w-full flex flex-col justify-start gap-2 font-gothic">
            <GraySelectorButton v-for="tab in tabs" @click="activeTab = tab.id" :id="tab.id" :label="tab.label"
                :active="activeTab === tab.id ? true : false" />
            <AprroveButtonWithText @click="saveCharacter" class="w-full" text="Підтвердити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                :class="[!canSave && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="state.unsavedChanges" />
        </div>

        <div id="base" v-if="activeTab === 'base'" class="grid grid-cols-2 auto-rows-min gap-x-4">

            <ImageEditor class="w-full" />

            <div>
                <TextAreaEditor fieldName="playerNotes" name="Записки гравця" :value="selected_character.playerNotes"
                    :callback="updateCharacter" />
                <TextAreaEditor fieldName="adminNotes" name="Записки майстра" :value="selected_character.adminNotes"
                    :callback="updateCharacter" />
            </div>


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

        </div>

        <div id="main" v-if="activeTab === 'main'" class="grid grid-cols-2 auto-rows-min gap-x-4">

            <div class="mt-6 h-min p-2 border-2 rounded-md">
                <h1 class="font-gothic font-medium text-2xl">Список кастомних полей:</h1>
                <CustomFieldsTable v-if="checkObjectFieldExisting(selected_character.customFields)"
                    :fields="selected_character.customFields" :callback="updateCustomFields" :field_removable="true" />
                <h1 class="font-gothic font-medium text-2xl">Додати нове поле:</h1>
                <ObjectFieldsEditor name="CustomFields_" :fields="selected_character.customFields"
                    :callback="addCustomField" />
            </div>

            <div class="mt-6 h-min p-2 border-2 rounded-md">
                <h1 class="font-gothic font-medium text-2xl">Список Характеристик:</h1>
                <CustomFieldsTable v-if="checkObjectFieldExisting(selected_character.characteristics)"
                    :fields="selected_character.characteristics" :callback="updateCharacterCharacteristic"
                    :field_removable="true" />
                <h1 class="font-gothic font-medium text-2xl">Додати нову харакетристику:</h1>
                <ObjectFieldsEditor name="Characteristics_" :fields="selected_character.characteristics"
                    :callback="addCharacterCharacteristic" />
            </div>

        </div>

        <div id="health" v-if="activeTab === 'health'" class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-2">

            <div v-for="h in selected_character.health">
                <div class="p-1 grow">
                    <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
                </div>

                <HorizontalNumberPicker :value="h.value" :min="-h.value" :max="h.max - h.value" :colors="h.colors"
                    :callback="updateHealthFields" :title="h.name" />
            </div>

            <HealthFieldsEditor name="Health" class="col-span-2" :callback="addHealthField" />

        </div>

        <div id="inventory" v-if="activeTab === 'inventory'" class="flex flex-col items-center gap-y-4">

            <section class="flex gap-2 self-start">
                <GraySelectorButton v-for="inv in inventories" @click="activeInventory = inv.id" :id="inv.id"
                    :label="inv.label" :active="activeInventory === inv.id ? true : false" />
            </section>

            <section id="weapon" v-if="activeInventory === 'weapon'" class="border rounded-lg p-2 w-[600px]">
                <div class="grid grid-cols-1 w-full">
                    <WeaponRow :weapons_all="state.session.weapons" :weapons="selected_character.weapons"
                        :callback="updateInventory" />
                </div>
            </section>

            <section id="armor" v-if="activeInventory === 'armor'" class="border rounded-lg p-2 w-[600px]">
                <div class="grid grid-cols-1 w-full">
                    <ArmorRow :armors_all="state.session.armors" :armors="selected_character.armor"
                        :callback="updateInventory" />
                </div>
            </section>

            <section id="medicine" v-if="activeInventory === 'medicine'" class="border rounded-lg p-2 w-[600px]">

                <div class="grid grid-cols-1 w-full">
                    <MedsRow :medicines_all="state.session.medicines" :medicines="selected_character.medicines"
                        :effects_all="state.session.effects" :effects="selected_character.effects"
                        :move="state.session.move" :callback="updateInventory" />
                </div>
            </section>

            <section id="inventory" v-if="activeInventory === 'inventory'" class="border rounded-lg p-2 w-[600px]">
                <div class="grid grid-cols-1 w-ful">
                    <InventoryRow :inventory_all="state.session.inventories" :inventory="selected_character.inventory"
                        :callback="updateInventory" />
                </div>
            </section>

            <section id="perk" v-if="activeInventory === 'perk'" class="border rounded-lg p-2 w-[600px]">
                <div class="grid grid-cols-1 w-full">
                    <PerkRow v-if="state.session.perks" :perks_all="state.session.perks"
                        :perks="selected_character.perks" :perkPoints="1" :callback="updateInventory"
                        :removable="true" />
                </div>
            </section>

        </div>

    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>