<script setup>
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { ref, computed, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import useFilteredArray from '/utils/useFilteredArray';
import { useSessionStore } from '@/stores/sessionStore';

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
import EffectsTable from '@/components/character-page components/EffectsTable.vue';
import PerkRowView from '@/components/character-page components/EntityRows/PerkRowView.vue';
import EntityRowView from '@/components/character-page components/EntityRows/EntityRowView.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import { CheckBadgeIcon, PlusCircleIcon, HeartIcon } from '@heroicons/vue/24/solid';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { socket } from '@ws/webSocket';
import { checkObjectFieldExisting, groupById, addRow, removeRow, removeAllRows, mapPerksWithCount } from '/utils/entityHelper';
import { toNewCharacterObject } from '/utils/objects.dto';
import { notify, notifySyncSuccess } from '/utils/notification';

const sessionId = useRoute().params.sessionId
const store = useSessionStore()
const selectedCharacter = ref()
const unsavedChanges = ref(false)
const copied = ref(false)

const types = ref({})

const searchQuery = ref({
    characterEntity: '',
    sessionEntity: '',
    perks: '',
    characterEffects: '',
    sessionEffects: ''
})

const filteredSessionEntities = useFilteredArray(computed(() => store.session.entities), computed(() => searchQuery.value.sessionEntity), computed(() => types.value.inventory))
const filteredCharacterEntities = useFilteredArray(computed(() => selectedCharacter.value.entities), computed(() => searchQuery.value.characterEntity), computed(() => types.value.inventory), { groupFn: groupById })
const filteredPerks = useFilteredArray(computed(() => mapPerksWithCount(selectedCharacter.value.perks, store.session.perks)), computed(() => searchQuery.value.perks), computed(() => types.value.perks))

const filteredCharacterEffects = computed(() => {
    const list = selectedCharacter.value.effects
    const query = searchQuery.value.characterEffects.trim().toLowerCase()
    return query ? list.filter(effect => effect.name?.toLowerCase().includes(query)) : list
})
const filteredSessionEffects = computed(() => {
    const list = store.session.effects
    const query = searchQuery.value.sessionEffects.trim().toLowerCase()
    return query ? list.filter(effect => effect.name?.toLowerCase().includes(query)) : list
})

const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Базові характеристики' },
    { id: 'custom', label: 'Кастомні поля' },
    { id: 'health', label: "Здоров'я" },
    { id: 'effects', label: 'Еффекти' },
    { id: 'perks', label: 'Перки' },
    { id: 'inventory', label: 'Інвентар' }
]

watch(
    () => store.isLoading,
    (isLoading) => {
        if (isLoading) return
        init()
    },
    { immediate: true }
)

watch(
    () => store.session,
    (newSession) => {
        if (!selectedCharacter.value || selectedCharacter.value.id === 'new') return

        const updated = newSession.characters.find(el => el.id === selectedCharacter.value.id)
        reloadCharacter(updated ? updated.id : 'new', updated && structuredClone(toRaw(updated)))
    }
)

function init() {
    types.value.inventory = buildTypes(store.session.entityTypes)
    types.value.perks = buildTypes(store.session.perkTypes)

    selectCharacter('new')
}

//API calls

async function saveCharacter() {

    const character = toRaw(selectedCharacter.value)

    if (character.name !== '') {

        if (character.id === 'new') {
            const [res, err] = await asyncHandler(
                RepositoryFactory.create('character', character)
            )
            if (err) return
            reloadCharacter(res.data.id, res.data)

        } else {
            const [res, err] = await asyncHandler(
                RepositoryFactory.update('character', character.id, character)
            )
            if (err) return
            reloadCharacter(res.data.id, res.data)
        }

        socket.emit('session:updateDataNotify', sessionId);

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
        RepositoryFactory.delete('character', selectedCharacter.value.id)
    )
    if (err) {
        return
    }
    socket.emit('session:updateDataNotify', sessionId);
    reloadCharacter('new')
}

//Select/Reload character

function newCharacterFields() {
    const characteristics = store.session.characteristicsList.map(ch => ({ 'name': ch.name, 'value': '', id: crypto.randomUUID() }))
    const currency = store.session.currencyTypes.map(c => ({ 'name': c.name, 'value': 0, 'icon': c.icon, id: crypto.randomUUID() }))
    return toNewCharacterObject({ characteristics, currency, session: sessionId })
}

function reloadCharacter(id, data = { id }) {
    markSaved()

    if (id === 'new')
        selectedCharacter.value = newCharacterFields()
    else selectedCharacter.value = toNewCharacterObject(data)
}

function selectCharacter(id, check = false) {
    if (selectedCharacter.value?.id === id && check) return
    if (unsavedChanges.value) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    markSaved()

    if (id === 'new') {
        selectedCharacter.value = newCharacterFields()
    }
    else selectedCharacter.value = toNewCharacterObject(structuredClone(toRaw(store.session.characters.find(el => el.id === id))))
}

function discardChanges() {
    markSaved()

    if (selectedCharacter.value.id === 'new') selectCharacter('new')
    else selectCharacter(selectedCharacter.value.id)

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

// service functions

function buildTypes(list) {
    return [
        {
            name: 'Всі',
            id: 'all',
            hidden: false
        },
        ...list.map(type => ({
            name: type.name,
            id: type.id,
            hidden: true
        }))
    ]
}

function resetSearchQuery() {
    Object.entries(searchQuery.value).forEach(([key, val]) => {
        searchQuery.value[key] = ''
    })
}

function markUnsaved() {
    unsavedChanges.value = true
}

function markSaved() {
    unsavedChanges.value = false
    copied.value = true
    resetSearchQuery()
}

function showType(listKey, id) {
    types.value[listKey].forEach(type => {
        type.hidden = type.id !== id
    })

    resetSearchQuery()
}

// character functions

function updateCurrency(fields) {
    selectedCharacter.value.currency = fields
    markUnsaved()
}

function addCustomField(object) {
    selectedCharacter.value.customFields.push(object)
    markUnsaved();
}

function updateCustomFields(fields) {
    selectedCharacter.value.customFields = fields
    markUnsaved();
}

function addEffect(effect) {
    addRow(store.session.effects, selectedCharacter.value.effects, effect.id)
    markUnsaved()
}

function removeEffect(effect) {
    removeRow(selectedCharacter.value.effects, effect.id)
    markUnsaved()
}

function updateHealthFields(field) {
    selectedCharacter.value.health =
        selectedCharacter.value.health.map(h =>
            h.id === field.id ? field : h
        )

    markUnsaved();
}

function deleteHealthField(field) {
    selectedCharacter.value.health = selectedCharacter.value.health.filter(h => h.id !== field.id)
    markUnsaved();
}

function addHealthField(field) {
    selectedCharacter.value.health.push(field)
    markUnsaved();
}

function addEntity(entity) {
    addRow(store.session.entities, selectedCharacter.value.entities, entity.id)
    markUnsaved()
}

function removeEntity(entity) {
    removeRow(selectedCharacter.value.entities, entity.id)
    markUnsaved()
}

function levelUpPerk(perk) {
    const maxLevel = perk.levels?.length || 1
    if (perk.count >= maxLevel) return

    addRow(store.session.perks, selectedCharacter.value.perks, perk.id)
    markUnsaved()
}

function levelDownPerk(perk) {
    if (!perk.count) return

    removeRow(selectedCharacter.value.perks, perk.id)
    markUnsaved()
}

function removePerkFully(perk) {
    removeAllRows(selectedCharacter.value.perks, perk.id)
    markUnsaved()
}

const canSave = computed(() => unsavedChanges.value)

watch(() => selectedCharacter.value, () => {

    if (copied.value) {
        copied.value = false
        return
    }

    markUnsaved()
}, { deep: true, immediate: false })

</script>

<template>

    <MasterPageNavigation />

    <section v-if="!store.isLoading" class="p-2 grid grid-cols-[25%_1fr] overflow-hidden">

        <section class="h-full overflow-y-auto">

            <div class="p-2 w-full flex flex-col justify-start gap-2 font-gothic overflow-y-auto">
                <GraySelectorButton v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :id="tab.id"
                    :label="tab.label" :active="activeTab === tab.id ? true : false" />
                <RejectButtonWithText @click="deleteCharacter" class="w-full" text="Видалити персонажа"
                    v-if="selectedCharacter.id !== 'new'" />
                <AprroveButtonWithText @click="saveCharacter" class="w-full" text="Підтвердити"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" />
                <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                    :class="[!canSave && 'pointer-events-none opacity-50']" />
                <UnsavedLabel v-if="unsavedChanges" />
            </div>

        </section>

        <section class="m-4 py-4 h-full space-y-2 overflow-y-auto">

            <div class="flex items-center justify-center space-x-4 m-2">
                <GraySelectorButton v-for="character in store.session.characters" :key="character.id"
                    @click="selectCharacter(character.id, true)" :id="character.id" :label="character.name"
                    :active="selectedCharacter.id === character.id ? true : false" />
                <PlusButton @click="selectCharacter('new', true)" class="w-16 h-14 border-4 border-darkred-dark rounded-lg
           md:hover:bg-darkred-gray group"
                    :class="selectedCharacter.id === 'new' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
            </div>

            <div id="base" v-if="activeTab === 'base'" class="grid grid-cols-2 auto-rows-min gap-4">

                <ImageEditor class="w-full col-span-2" v-model:image="selectedCharacter.image"
                    label="Character image" />

                <InputTextReactive placeholder="Ім'я" fieldName="name" v-model:inputValue="selectedCharacter.name"
                    :important="true" class="w-full" />

                <InputTextReactive placeholder="Стать" fieldName="gender" v-model:inputValue="selectedCharacter.gender"
                    class="w-full" />

                <InputTextReactive placeholder="Клас" fieldName="class" v-model:inputValue="selectedCharacter.class"
                    class="w-full" />

                <InputTextReactive placeholder="Раса" fieldName="race" v-model:inputValue="selectedCharacter.race"
                    class="w-full" />

                <InputTextReactive placeholder="Рівень" fieldName="level" v-model:inputValue="selectedCharacter.level"
                    type="number" class="w-full" />

                <InputTextReactive placeholder="Очки перків" fieldName="perkPoints"
                    v-model:inputValue="selectedCharacter.perkPoints" type="number" class="w-full" />

                <InputTextReactive placeholder="Досвід" fieldName="experience"
                    v-model:inputValue="selectedCharacter.experience" type="number" class="w-full" />

                <InputTextReactive placeholder="К-сть досвіду для рівня" fieldName="experienceToLevelUp"
                    v-model:inputValue="selectedCharacter.experienceToLevelUp" type="number" class="w-full" />

                <TextAreaReactive label="Записи гравця" v-model:value="selectedCharacter.playerNotes" />

                <TextAreaReactive label="Записи майстра" v-model:value="selectedCharacter.adminNotes" />

                <Header1 class="col-span-2 justify-self-center" label="Список основних характеистик:" />

                <Header1 v-if="!checkObjectFieldExisting(selectedCharacter.characteristics)" class="col-span-2"
                    label="Пусто" />

                <div v-if="checkObjectFieldExisting(selectedCharacter.characteristics)"
                    class="col-span-full grid grid-cols-2 gap-2">

                    <InputTextReactive v-for="characteristic in selectedCharacter.characteristics" :key="characteristic.name"
                        :label="characteristic.name" fieldName="characteristicValue"
                        v-model:inputValue="characteristic.value" class="w-full" />

                </div>

                <Header1 class="col-span-2 justify-self-center" label="Список фінансів:" />

                <Header1 v-if="!checkObjectFieldExisting(selectedCharacter.currency)" class="col-span-2"
                    label="Пусто" />

                <CurrencyTable :currency_array="selectedCharacter.currency" :callback="updateCurrency" />

            </div>

            <div id="custom" v-if="activeTab === 'custom'" class="grid grid-cols-2 auto-rows-min gap-4 overflow-y-auto">

                <Header1 class="col-span-2 font-medium" label="Список кастомних полей:" />

                <Header1 v-if="!checkObjectFieldExisting(selectedCharacter.customFields)" class="col-span-2"
                    label="Пусто" />

                <CustomFieldTile v-if="checkObjectFieldExisting(selectedCharacter.customFields)"
                    :fields="selectedCharacter.customFields" @update:fields="updateCustomFields" />

                <Header1 class="col-span-2 font-medium" label="Додати нове поле:" />

                <CustomFieldsEditor class="col-span-2" name="characterCustomFields" :callback="addCustomField" />

            </div>

            <div id="health" v-if="activeTab === 'health'" class="grid gap-y-4 overflow-y-auto">

                <div class="p-3 rounded-xl bg-greenish-dark/10 border-2 border-greenish-mid/50 space-y-3">

                    <div class="flex items-center gap-2 justify-center">
                        <HeartIcon class="w-6 h-6 text-greenish-mid" />
                        <Header1 label="Поля здоров'я персонажа:" />
                        <span
                            class="text-sm px-2 py-0.5 rounded-full bg-greenish-mid text-darkred-dark font-semibold">{{
                                selectedCharacter.health.length }}</span>
                    </div>

                    <Header1 v-if="!checkObjectFieldExisting(selectedCharacter.health)"
                        class="justify-self-center text-lg text-darkred-light_gray" label="Полів ще немає" />

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <HealthFieldsEditor v-for="field in selectedCharacter.health" :key="field.id"
                            :label="field.name" :health_field="field" :callback="updateHealthFields"
                            :callback_remove="deleteHealthField" />
                    </div>

                </div>

                <div class="p-3 rounded-xl bg-orange-gold/10 border-2 border-orange-gold/50 space-y-3">

                    <div class="flex items-center gap-2 justify-center">
                        <PlusCircleIcon class="w-6 h-6 text-orange-gold" />
                        <Header1 label="Створити нове поле:" />
                    </div>

                    <HealthFieldsEditor label="Health" :callback="addHealthField" />

                </div>

            </div>

            <div id="effects" v-if="activeTab === 'effects'" class="grid gap-x-4 gap-y-3 overflow-y-auto">

                <div class="p-3 rounded-xl bg-greenish-dark/10 border-2 border-greenish-mid/50 space-y-2">

                    <div class="flex items-center gap-2 justify-center">
                        <CheckBadgeIcon class="w-6 h-6 text-greenish-mid" />
                        <Header1 label="Ефекти персонажа:" />
                        <span
                            class="text-sm px-2 py-0.5 rounded-full bg-greenish-mid text-darkred-dark font-semibold">{{
                                filteredCharacterEffects.length }}</span>
                    </div>

                    <div class="flex gap-2">
                        <input v-model="searchQuery.characterEffects" placeholder="Пошук ..."
                            class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                        <RejectButtonWithText v-if="searchQuery.characterEffects"
                            @click="searchQuery.characterEffects = ''" text="Очистити" />
                    </div>

                    <Header1 v-if="!filteredCharacterEffects.length"
                        class="justify-self-center text-lg text-darkred-dark_gray" label="Ефектів немає" />

                    <EffectsTable v-else :effects="filteredCharacterEffects" :removable="true"
                        :callback_remove="removeEffect" />

                </div>

                <div class="p-3 rounded-xl bg-darkred-dark_gray/40 border-2 border-darkred-gray/40 space-y-2">

                    <div class="flex items-center gap-2 justify-center">
                        <PlusCircleIcon class="w-6 h-6 text-darkred-light_gray" />
                        <Header1 label="Усі ефекти:" />
                        <span
                            class="text-sm px-2 py-0.5 rounded-full bg-darkred-gray text-darkred-dark font-semibold">{{
                                filteredSessionEffects.length }}</span>
                    </div>

                    <div class="flex gap-2">
                        <input v-model="searchQuery.sessionEffects" placeholder="Пошук ..."
                            class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                        <RejectButtonWithText v-if="searchQuery.sessionEffects"
                            @click="searchQuery.sessionEffects = ''" text="Очистити" />
                    </div>

                    <Header1 v-if="!filteredSessionEffects.length"
                        class="justify-self-center text-lg text-darkred-light_gray" label="Ефектів немає" />

                    <EffectsTable v-else :effects="filteredSessionEffects" :addable="true"
                        :callback_add="addEffect" />

                </div>

            </div>

            <div id="perks" v-if="activeTab === 'perks'"
                class="grid grid-cols-3 auto-rows-min gap-x-4 gap-y-3 overflow-y-auto">

                <div class="w-full col-span-full flex gap-2 justify-center">

                    <GraySelectorButton v-for="type in types.perks" :label="type.name" :key="type.id" :id="type.id"
                        :active="!type.hidden" @click="showType('perks', type.id)" />
                </div>

                <div
                    class="col-span-full grid grid-cols-3 auto-rows-min gap-x-4 gap-y-3 p-3 rounded-xl bg-darkred-dark_gray/40 border-2 border-darkred-gray/40">

                    <div class="col-span-full flex items-center gap-2 justify-center">
                        <CheckBadgeIcon class="w-6 h-6 text-greenish-mid" />
                        <Header1 label="Перки:" />
                        <span
                            class="text-sm px-2 py-0.5 rounded-full bg-darkred-gray text-darkred-dark font-semibold">{{
                                filteredPerks.length }}</span>
                    </div>

                    <div class="col-span-3 flex gap-2">
                        <input v-model="searchQuery.perks" placeholder="Пошук ..."
                            class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                        <RejectButtonWithText v-if="searchQuery.perks" @click="searchQuery.perks = ''"
                            text="Очистити" />
                    </div>

                    <Header1 v-if="!filteredPerks.length"
                        class="col-span-full justify-self-center text-lg text-darkred-light_gray"
                        label="Перків не знайдено" />

                    <PerkRowView v-for="perk in filteredPerks" :key="perk.id" :perk="perk"
                        :callback_level_up="levelUpPerk" :callback_level_down="levelDownPerk"
                        :callback_remove="removePerkFully" />

                </div>

            </div>

            <div id="inventory" v-if="activeTab === 'inventory'"
                class="flex flex-col items-center gap-y-4 overflow-y-auto">

                <div class="w-full flex gap-2 justify-center">
                    <GraySelectorButton v-for="type in types.inventory" :key="type.id" :label="type.name" :id="type.id"
                        :active="!type.hidden" @click="showType('inventory', type.id)" />
                </div>

                <div class="w-full flex flex-col gap-2 p-3 rounded-xl bg-greenish-dark/10 border-2 border-greenish-mid/50">

                    <div class="w-full flex items-center gap-2 justify-center">
                        <CheckBadgeIcon class="w-6 h-6 text-greenish-mid" />
                        <Header1 label="Інвентар персонажа:" />
                        <span
                            class="text-sm px-2 py-0.5 rounded-full bg-greenish-mid text-darkred-dark font-semibold">{{
                                filteredCharacterEntities.length }}</span>
                    </div>

                    <div class="flex gap-2">

                        <input v-model="searchQuery.characterEntity" placeholder="Пошук ..."
                            class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                        <RejectButtonWithText v-if="searchQuery.characterEntity"
                            @click="searchQuery.characterEntity = ''" text="Очистити" />
                    </div>

                    <Header1 v-if="!filteredCharacterEntities.length"
                        class="self-center text-lg text-darkred-light_gray" label="Інвентар пустий" />

                    <div class="w-full grid grid-cols-3 gap-2 max-h-[1024px] overflow-y-auto md:auto-hide-scroll">

                        <EntityRowView v-for="entity in filteredCharacterEntities" :key="entity.id" :entity="entity"
                            :owned="true" :callback_add="addEntity" :callback_remove="removeEntity" />

                    </div>
                </div>

                <div class="w-full flex flex-col gap-2 p-3 rounded-xl bg-darkred-dark_gray/40 border-2 border-darkred-gray/40">

                    <div class="w-full flex items-center gap-2 justify-center">
                        <PlusCircleIcon class="w-6 h-6 text-darkred-light_gray" />
                        <Header1 label="Весь інвентар:" />
                        <span
                            class="text-sm px-2 py-0.5 rounded-full bg-darkred-gray text-darkred-dark font-semibold">{{
                                filteredSessionEntities.length }}</span>
                    </div>

                    <div class="flex gap-2">

                        <input v-model="searchQuery.sessionEntity" placeholder="Пошук ..."
                            class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                        <RejectButtonWithText v-if="searchQuery.sessionEntity" @click="searchQuery.sessionEntity = ''"
                            text="Очистити" />
                    </div>

                    <Header1 v-if="!filteredSessionEntities.length"
                        class="self-center text-lg text-darkred-light_gray" label="Інвентар пустий" />

                    <div class="w-full grid grid-cols-3 gap-2 max-h-[512px] overflow-y-auto md:auto-hide-scroll">

                        <EntityRowView v-for="entity in filteredSessionEntities" :key="entity.id" :entity="entity"
                            :owned="false" :callback_add="addEntity" :callback_remove="removeEntity" />

                    </div>
                </div>

            </div>

        </section>

    </section>

    <div v-if="store.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>