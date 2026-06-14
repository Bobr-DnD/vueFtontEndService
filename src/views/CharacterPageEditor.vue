<script setup>
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { reactive, onMounted, ref, computed, toRaw, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket } from '@ws/webSocket';
import { isEqual } from 'lodash';
import useFilteredArray from '/utils/useFilteredArray';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import CustomFieldTile from '@/components/reusable/EntityTiles/CustomFieldTile.vue';
import CustomFieldsEditor from '@/components/reusable/CustomFieldsEditor.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import HealthFieldsEditor from '@/components/admin-page components/HealthFieldsEditor.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import CurrencyTable from '@/components/character-page components/CurrencyTable.vue';
import EffectsTableEditor from '@/components/admin-page components/EffectsTableEditor.vue';
import QuestsTableEditor from '@/components/admin-page components/QuestsTableEditor.vue';
import PerkRowView from '@/components/character-page components/EntityRows/PerkRowView.vue';
import EntityRowView from '@/components/character-page components/EntityRows/EntityRowView.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkObjectFieldExisting, filterPerksByRank, groupById, addRow, removeRow, filterPerksByRankWithoutCount } from '/utils/entityHelper';
import { toNewCharacterObject, toNewSession } from '/utils/objects.dto';
import { notify } from '/utils/notification';

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const selected_character = ref()
const editingCharacter = ref()

const types = ref({})

const searchQuery = ref({
    characterEntity: '',
    sessionEntity: '',
    characterPerks: '',
    sessionPerks: ''
})

const filteredSessionEntities = useFilteredArray(computed(() => state.session.entities), computed(() => searchQuery.value.sessionEntity), computed(() => types.value.inventory))
const filteredCharacterEntities = useFilteredArray(computed(() => selected_character.value.entities), computed(() => searchQuery.value.characterEntity), computed(() => types.value.inventory), { groupFn: groupById })
const filteredSessionPerks = useFilteredArray(computed(() => state.session.perks), computed(() => searchQuery.value.sessionPerks), computed(() => types.value.perks), { transformFn: () => filterPerksByRank(selected_character.value.perks, state.session.perks) })
const filteredCharacterPerks = useFilteredArray(computed(() => selected_character.value.perks), computed(() => searchQuery.value.characterPerks), computed(() => types.value.perks), { groupFn: groupById })

const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Базові характеристики' },
    { id: 'custom', label: 'Кастомні поля' },
    { id: 'health', label: "Здоров'я" },
    { id: 'quests', label: 'Квести' },
    { id: 'effects', label: 'Еффекти' },
    { id: 'perks', label: 'Перки' },
    { id: 'inventory', label: 'Інвентар' }
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
    state.session = toNewSession(resSession.data)

    types.value.inventory = buildTypes(state.session.entityTypes)
    types.value.perks = buildTypes(state.session.perkTypes)

    selected_character.value = newCharacter()
    editingCharacter.value = selected_character.value.id
})

onBeforeUnmount(() => {
    const events = ['character:updateNotify', 'session:updateNotify']
    events.forEach(e => socket.off(e))
})

socket.on('character:updateNotify', (character) => {
    if (character.id === selected_character.value.id) selected_character.value = toNewCharacterObject(character)
    else {
        state.session.characters = state.session.characters.map(ch =>
            ch.id === character.id ? toNewCharacterObject(character) : ch
        )
    }
    notify({ message: `Персонажа ${character.name} було оновлено`, type: 'warning' })
})

socket.on('session:updateNotify', (session) => {
    state.session = toNewSession(session)
    selected_character.value = state.session.characters.find(character => character.id === selected_character.value.id)
    notify({ message: `Сесію було оновлено майстром`, type: 'warning' })
})

async function saveCharacter() {

    if (selected_character.value.name !== '') {

        if (selected_character.value.id === 'new') {
            const [res, err] = await asyncHandler(
                RepositoryFactory.create('character', toRaw(selected_character.value))
            )
            if (err) return

            const [resSession, errSession] = await asyncHandler(
                RepositoryFactory.getById('session', sessionId)
            )
            if (errSession) return

            state.session = toNewSession(resSession.data)
            state.unsavedChanges = false

            notify({ message: 'Персонаж збережений', type: 'success' })
            socket.emit('session:updateNotify', resSession.data);
            selectCharacter(toNewCharacterObject(res.data))

        } else {
            const [res, err] = await asyncHandler(
                RepositoryFactory.update('character', selected_character.value.id, toRaw(selected_character.value))
            )
            if (err) return

            const [resSession, errSession] = await asyncHandler(
                RepositoryFactory.getById('session', sessionId)
            )
            if (errSession) return

            state.session = toNewSession(resSession.data)
            state.unsavedChanges = false

            notify({ message: 'Персонаж оновлений', type: 'success' })
            socket.emit('character:updateNotify', res.data)
            //selectCharacter(toNewCharacterObject(res.data))
        }
    }
    else {
        notify({ message: "У персонажа повинно бути ім'я", type: 'error' })
        return
    }
}

async function deleteCharacter() {

    const confirmSwitch = confirm('Видалити персонажа?')
        if (!confirmSwitch) return

    const [res, err] = await asyncHandler(
        RepositoryFactory.delete('character', selected_character.value.id)
    )
    if (err) {
        return
    }

    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) {
        return
    }

    state.session = toNewSession(resSession.data)
    state.unsavedChanges = false

    selectCharacter(newCharacter())
    notify({ message: 'Персонаж видалений', type: 'success' })
    socket.emit('session:updateNotify', resSession.data);
}

function buildTypes(list) {
    return [
        ...list.map(type => ({
            name: type.name,
            id: type.id,
            hidden: true
        })),
        {
            name: 'Всі',
            id: 'all',
            hidden: false
        }
    ]
}

function resetSearchQuery() {
    Object.entries(searchQuery.value).forEach(([key, val]) => {
        searchQuery.value[key] = ''
    })
}

function newCharacter() {
    const characteristics = state.session.characteristicsList.map(ch => ({ 'name': ch.name, 'value': 0, id: crypto.randomUUID() }))
    const currency = state.session.currencyTypes.map(c => ({ 'name': c.name, 'value': 0, 'icon': c.icon, id: crypto.randomUUID() }))
    return toNewCharacterObject({ characteristics, currency, session: sessionId })
}

function selectCharacter(character) {
    if (state.unsavedChanges) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    editingCharacter.value = character.id;
    state.unsavedChanges = false;

    if (character.id === 'new') {
        selected_character.value = newCharacter()
    }
    else selected_character.value = toNewCharacterObject(structuredClone(toRaw(character)))

    resetSearchQuery()
}

function discardChanges() {
    if (!editingCharacter.value) return
    let current;

    if (editingCharacter.value !== 'new')
        current = state.session.characters.find(c => c.id === editingCharacter.value);
    else current = newCharacter();

    if (current) selected_character.value = structuredClone(toRaw(current))
    state.unsavedChanges = false

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function markUnsaved() {
    if (editingCharacter.value) state.unsavedChanges = true
}

function showType(listKey, id) {
    types.value[listKey].forEach(type => {
        type.hidden = type.id !== id
    })

    resetSearchQuery()
}

function updateCurrency(fields) {
    selected_character.value.currency = fields
    markUnsaved()
}

function addCustomField(object) {
    selected_character.value.customFields.push(object)
    markUnsaved();
}

function removeCustomField(id) {
    selected_character.value.customFields = selected_character.value.customFields.filter(el => el.id !== id)
    markUnsaved();
}

function updateEffects(effects) {
    selected_character.value.effects = effects
    markUnsaved()
}

function updateQuests(quests) {
    selected_character.value.quests = quests
    markUnsaved()
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

function addEntity(entity) {
    addRow(state.session.entities, selected_character.value.entities, entity.id)
    markUnsaved()
}

function removeEntity(entity) {
    removeRow(selected_character.value.entities, entity.id)
    markUnsaved()
}

function removerPerk(perk) {
    removeRow(selected_character.value.perks, perk.id)
    markUnsaved()
}

function addPerk(perk) {
    addRow(state.session.perks, selected_character.value.perks, perk.id)
    markUnsaved()
}

const canSave = computed(() => state.unsavedChanges && editingCharacter.value)

const keysToWatch = [
    'name',
    'image',
    'gender',
    'class',
    'race',
    'level',
    'experience',
    'experienceToLevelUp',
    'perkPoints',
    'adminNotes',
    'playerNotes'
]

watch([selected_character, editingCharacter], ([newVal1, newVal2], [oldVal1, oldVal2]) => {

    if (newVal2 !== oldVal2) return

    let current = state.session.characters.find(ch => ch.id === selected_character.value.id)
    if (!current) current = newCharacter()

    const isChanged = keysToWatch.some(key =>
        !isEqual(current[key], selected_character.value[key])
    )

    if (isChanged) markUnsaved()
}, { deep: true })

</script>

<template>

    <MasterPageNavigation />

    <div v-if="!state.isLoading" class="flex items-center justify-center space-x-4 m-2">
        <GraySelectorButton v-for="character in state.session.characters" :key="character.id"
            @click="selectCharacter(character)" :id="character.id" :label="character.name"
            :active="selected_character.id === character.id ? true : false" />
        <PlusButton @click="selectCharacter({ id: 'new' })" class="w-16 h-14 border-4 border-darkred-dark rounded-lg
           md:hover:bg-darkred-gray group"
            :class="selected_character.id === 'new' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
    </div>

    <section v-if="!state.isLoading" class="m-4 mr-8 grid grid-cols-[25%_75%] gap-2">

        <div class="p-4 w-full flex flex-col justify-start gap-2 font-gothic">
            <GraySelectorButton v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :id="tab.id"
                :label="tab.label" :active="activeTab === tab.id ? true : false" />
            <RejectButtonWithText @click="deleteCharacter" class="w-full" text="Видалити персонажа"
                v-if="selected_character.id !== 'new'" />
            <AprroveButtonWithText @click="saveCharacter" class="w-full" text="Підтвердити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                :class="[!canSave && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="state.unsavedChanges" />
        </div>

        <div id="base" v-if="activeTab === 'base'" class="grid grid-cols-2 auto-rows-min gap-4">

            <ImageEditor class="w-full col-span-2" v-model:image="selected_character.image" label="Character image" />

            <InputTextReactive placeholder="Ім'я" fieldName="name" v-model:inputValue="selected_character.name"
                :important="true" class="w-full" />

            <InputTextReactive placeholder="Стать" fieldName="gender" v-model:inputValue="selected_character.gender"
                class="w-full" />

            <InputTextReactive placeholder="Клас" fieldName="class" v-model:inputValue="selected_character.class"
                class="w-full" />

            <InputTextReactive placeholder="Раса" fieldName="race" v-model:inputValue="selected_character.race"
                class="w-full" />

            <InputTextReactive placeholder="Рівень" fieldName="level" v-model:inputValue="selected_character.level"
                type="number" class="w-full" />

            <InputTextReactive placeholder="Очки перків" fieldName="perkPoints"
                v-model:inputValue="selected_character.perkPoints" type="number" class="w-full" />

            <InputTextReactive placeholder="Досвід" fieldName="experience"
                v-model:inputValue="selected_character.experience" type="number" class="w-full" />

            <InputTextReactive placeholder="К-сть досвіду для рівня" fieldName="experienceToLevelUp"
                v-model:inputValue="selected_character.experienceToLevelUp" type="number" class="w-full" />

            <TextAreaReactive label="Записи гравця" v-model:value="selected_character.playerNotes" />

            <TextAreaReactive label="Записи майстра" v-model:value="selected_character.adminNotes" />

            <Header1 class="col-span-2 justify-self-center" label="Список основних характеистик:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.characteristics)" class="col-span-2"
                label="Пусто" />

            <!-- <CustomFieldTile v-if="checkObjectFieldExisting(selected_character.characteristics)"
                :fields="selected_character.characteristics" :callback="updateCharacterCharacteristic" /> -->

            <Header1 class="col-span-2 justify-self-center" label="Список фінансів:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.currency)" class="col-span-2" label="Пусто" />

            <CurrencyTable :currency_array="selected_character.currency" :callback="updateCurrency" />

        </div>

        <div id="custom" v-if="activeTab === 'custom'" class="grid grid-cols-2 auto-rows-min gap-4">

            <Header1 class="col-span-2 font-medium" label="Список кастомних полей:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.customFields)" class="col-span-2"
                label="Пусто" />

            <div v-for="(field, index) in selected_character.customFields" :key="field.id">
                <CustomFieldTile v-if="checkObjectFieldExisting(selected_character.customFields)"
                    v-model:customField="selected_character.customFields[index]" :callback_remove="removeCustomField"
                    :field_removable="true" />
            </div>

            <Header1 class="col-span-2 font-medium" label="Додати нове поле:" />

            <CustomFieldsEditor class="col-span-2" name="characterCustomFields" :callback="addCustomField" />

        </div>

        <div id="health" v-if="activeTab === 'health'" class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-3">

            <Header1 class="col-span-2 justify-self-center font-medium" label="Редагування існуючи полей:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.health)" class="col-span-2" label="Пусто" />

            <HealthFieldsEditor v-for="field in selected_character.health" :key="field.id" :label="field.name"
                :health_field="field" class="col-span-2" :callback="updateHealthFields"
                :callback_remove="deleteHealthField" />

            <Header1 class="col-span-2 justify-self-center font-medium" label="Створити нове поле::" />

            <HealthFieldsEditor label="Health" class="col-span-2" :callback="addHealthField" />

        </div>

        <div id="quests" v-if="activeTab === 'quests'" class="grid gap-x-4 gap-y-3">

            <Header1 class="justify-self-center" label="Квести:" />

            <QuestsTableEditor class="flex flex-col gap-2" :session_quests="state.session.quests"
                :character_quests="selected_character.quests" :callback="updateQuests" />
        </div>

        <div id="effects" v-if="activeTab === 'effects'" class="grid gap-x-4 gap-y-3">

            <Header1 class="justify-self-center" label="Еффекти:" />

            <EffectsTableEditor :sessionEffects="state.session.effects" :character_effects="selected_character.effects"
                :callback="updateEffects" />

        </div>

        <div id="perks" v-if="activeTab === 'perks'" class="grid grid-cols-3 auto-rows-min gap-x-4 gap-y-3">

            <div class="w-full col-span-full flex gap-2 justify-center">

                <GraySelectorButton v-for="type in types.perks" :label="type.name" :id="type.id" :active="!type.hidden"
                    @click="showType('perks', type.id)" />
            </div>

            <Header1 class="col-span-full justify-self-center" label="Перки персонажа: " />

            <div class="col-span-3 flex gap-2">
                <input v-model="searchQuery.characterPerks" placeholder="Пошук ..."
                    class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                <RejectButtonWithText v-if="searchQuery.characterPerks" @click="searchQuery.characterPerks = ''"
                    text="Очистити" />
            </div>

            <PerkRowView v-for="perk in filteredCharacterPerks" :perk="perk" :removable="true"
                :callback_remove="removerPerk" />

            <Header1 class="col-span-full justify-self-center" label="Усі перки: " />

            <div class="col-span-3 flex gap-2">
                <input v-model="searchQuery.sessionPerks" placeholder="Пошук ..."
                    class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                <RejectButtonWithText v-if="searchQuery.sessionPerks" @click="searchQuery.sessionPerks = ''"
                    text="Очистити" />
            </div>

            <PerkRowView v-for="perk in filteredSessionPerks" :perk="perk" :addable="true" :callback_add="addPerk" />

        </div>

        <div id="inventory" v-if="activeTab === 'inventory'" class="flex flex-col items-center gap-y-4">

            <div class="w-full flex gap-2 justify-center">
                <GraySelectorButton v-for="type in types.inventory" :label="type.name" :id="type.id"
                    :active="!type.hidden" @click="showType('inventory', type.id)" />
            </div>

            <Header1 class="self-start" label="Інвентар персонажа:" />

            <div class="w-full flex flex-col gap-2">

                <div class="flex gap-2">

                    <input v-model="searchQuery.characterEntity" placeholder="Пошук ..."
                        class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                    <RejectButtonWithText v-if="searchQuery.characterEntity" @click="searchQuery.characterEntity = ''"
                        text="Очистити" />
                </div>

                <div class="w-full grid grid-cols-3 gap-2 max-h-[1024px] overflow-y-auto md:auto-hide-scroll">

                    <EntityRowView v-for="entity in filteredCharacterEntities" :entity="entity"
                        :callback_add="addEntity" :callback_remove="removeEntity" />

                </div>
            </div>

            <Header1 class="self-start" label="Весь інвентар:" />

            <div class="w-full flex flex-col gap-2">

                <div class="flex gap-2">

                    <input v-model="searchQuery.sessionEntity" placeholder="Пошук ..."
                        class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                    <RejectButtonWithText v-if="searchQuery.sessionEntity" @click="searchQuery.sessionEntity = ''"
                        text="Очистити" />
                </div>

                <div class="w-full grid grid-cols-3 gap-2 max-h-[512px] overflow-y-auto md:auto-hide-scroll">

                    <EntityRowView v-for="entity in filteredSessionEntities" :entity="entity" :callback_add="addEntity"
                        :callback_remove="removeEntity" />

                </div>
            </div>

        </div>

    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>