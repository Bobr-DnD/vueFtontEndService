<script setup>
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { reactive, onMounted, ref, computed, toRaw, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { socket } from '@ws/webSocket';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue'
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import ObjectFieldsTable from '@/components/reusable/ObjectFieldsTable.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
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
import { toObject, toNewCharacterObject, toNewSession } from '/utils/objects.dto';
import { notify } from '/utils/notification';

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const selected_character = ref(toNewCharacterObject({}))
const editingCharacter = ref(selected_character.value.id)

//perks variables
const filteredCharacterPerks = ref([])
const filteredSessionPerks = ref([])
const filteredCharacterEntities = ref([])

const inventoryTypes = ref([])
const perkTypes = ref([])
const activePerkType = ref('')
const activeType = ref('')

const characterEntitySearchQuery = ref('')
const sessionEntitySearchQuery = ref('')
const characterPerksSearchQuery = ref('')
const sessionPerksSearchQuery = ref('')

const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Базові характеристики' },
    { id: 'custom', label: 'Кастомні поля' },
    { id: 'health', label: "Здоров'я" },
    { id: 'quests&effects', label: 'Квести та еффекти' },
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
    checkTypes()
})

function checkTypes() {
    inventoryTypes.value = state.session.entityTypes.map(type => {
        return {
            name: type.name,
            id: type.id,
            hidden: true
        }
    })

    perkTypes.value = state.session.perkTypes.map(type => {
        return {
            name: type.name,
            id: type.id,
            hidden: true,
        }
    })

    perkTypes.value.push({
        name: 'Усі',
        id: 'all',
        hidden: false
    })

    inventoryTypes.value.push({
        name: 'Усі',
        id: 'all',
        hidden: false
    })

    activePerkType.value = 'all'
    activeType.value = inventoryTypes.value[inventoryTypes.value.length - 1]
}

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

filteredCharacterEntities.value.entities = computed(() => {
    const groupedArray = groupById(selected_character.value.entities)

    if (!characterEntitySearchQuery.value.trim()) return groupedArray
    const query = characterEntitySearchQuery.value.toLowerCase()
    return groupedArray.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

filteredCharacterPerks.value.perks = computed(() => {
    const groupedArray = groupById(selected_character.value.perks)

    if (!characterPerksSearchQuery.value.trim()) return groupedArray
    const query = characterPerksSearchQuery.value.toLowerCase()
    return groupedArray.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

filteredSessionPerks.value.perks = computed(() => {
    const groupedArray = filterPerksByRank(selected_character.value.perks, state.session.perks)
    groupedArray.forEach(el => el.count++)  //CHECK may broke some descriptions

    if (!sessionPerksSearchQuery.value.trim()) return groupedArray
    const query = sessionPerksSearchQuery.value.toLowerCase()
    return groupedArray.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

//entities
function showEntityType(id) {
    inventoryTypes.value.forEach(type => {
        if (type.id === id) {
            type.hidden = false
            activeType.value = type
        }
        else type.hidden = true
    });

    characterEntitySearchQuery.value = ''
    sessionEntitySearchQuery.value = ''
}

function getFilteredCharacterEntities(type) {
    if (type.id === 'all')
        return filteredCharacterEntities.value.entities
            .filter(e =>
                e.name.toLowerCase().includes(characterEntitySearchQuery.value.toLowerCase())
            )

    return filteredCharacterEntities.value.entities
        .filter(e => e.type === type.name)
        .filter(e =>
            e.name.toLowerCase().includes(characterEntitySearchQuery.value.toLowerCase())
        )
}

function getFilteredSessionEntities(type) {
    if (type.id === 'all')
        return state.session.entities
            .filter(e =>
                e.name.toLowerCase().includes(sessionEntitySearchQuery.value.toLowerCase())
            )

    return state.session.entities
        .filter(e => e.type === type.name)
        .filter(e =>
            e.name.toLowerCase().includes(sessionEntitySearchQuery.value.toLowerCase())
        )
}
//perks
function showPerkType(id) {

    perkTypes.value.forEach(type => {
        if (type.id === id) {
            type.hidden = false
            activePerkType.value = id === 'all' ? type.id : type.name
        }
        else type.hidden = true
    });

    characterPerksSearchQuery.value = ''
    sessionPerksSearchQuery.value = ''
}

function getFilteredSessionPerks(type) {

    if (type === 'all')
        return filteredSessionPerks.value.perks.filter(e =>
            e.name.toLowerCase().includes(sessionPerksSearchQuery.value.toLowerCase())
        )

    return filteredSessionPerks.value.perks
        .filter(e => e.type.name === type)
        .filter(e =>
            e.name.toLowerCase().includes(sessionPerksSearchQuery.value.toLowerCase())
        )
}

function getFilteredCharacterPerks(type) {

    if (type === 'all')
        return filteredCharacterPerks.value.perks.filter(e =>
            e.name.toLowerCase().includes(characterPerksSearchQuery.value.toLowerCase())
        )

    return filteredCharacterPerks.value.perks
        .filter(e => e.type.name === type)
        .filter(e =>
            e.name.toLowerCase().includes(characterPerksSearchQuery.value.toLowerCase())
        )
}

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

    characterPerksSearchQuery.value = ''
    sessionPerksSearchQuery.value = ''
}

function markUnsaved() {
    if (editingCharacter.value) state.unsavedChanges = true
}

async function saveCharacter() {

    if (selected_character.value.name !== '') {
        selected_character.value.session = sessionId

        if (selected_character.value.id === 'empty') {
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

            state.session = resSession.data
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

    selectCharacter(toNewCharacterObject({}))
    notify({ message: 'Персонаж видалений', type: 'success' })
    socket.emit('session:updateNotify', resSession.data);
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

function updateCharacterField(field, value) {
    selected_character.value[field] = value
    markUnsaved();
}

function updateCharacterCharacteristic(fields) {
    selected_character.value.characteristics = fields
    markUnsaved();
}

function updateCurrency(fields) {
    selected_character.value.currency = fields
    markUnsaved()
}

function updateCustomFields(fields) {
    selected_character.value.customFields = fields
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

function addCustomField(name, value) {
    Object.assign(selected_character.value.customFields, toObject({ name, value }))
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

            <SingleFieldEditor placeholder="Ім'я" fieldName="name" :value="selected_character.name"
                :callback="updateCharacterField" :important="true" class="w-full" />
            <SingleFieldEditor placeholder="Стать" fieldName="gender" :value="selected_character.gender"
                :callback="updateCharacterField" class="w-full" />
            <SingleFieldEditor placeholder="Клас" fieldName="class" :value="selected_character.class"
                :callback="updateCharacterField" class="w-full" />
            <SingleFieldEditor placeholder="Раса" fieldName="race" :value="selected_character.race"
                :callback="updateCharacterField" class="w-full" />

            <SingleFieldEditor placeholder="Рівень" fieldName="level" :value="selected_character.level"
                :callback="updateCharacterField" type="number" class="w-full" />
            <SingleFieldEditor placeholder="Очки перків" fieldName="perkPoints" :value="selected_character.perkPoints"
                :callback="updateCharacterField" type="number" class="w-full" />
            <SingleFieldEditor placeholder="Досвід" fieldName="experience" :value="selected_character.experience"
                :callback="updateCharacterField" type="number" class="w-full" />
            <SingleFieldEditor placeholder="К-сть досвіду для рівня" fieldName="experienceToLevelUp"
                :value="selected_character.experienceToLevelUp" :callback="updateCharacterField" type="number"
                class="w-full" />

            <TextAreaEditor fieldName="playerNotes" name="Записки гравця" :value="selected_character.playerNotes"
                :callback="updateCharacterField" />
            <TextAreaEditor fieldName="adminNotes" name="Записки майстра" :value="selected_character.adminNotes"
                :callback="updateCharacterField" />

            <Header1 class="col-span-2 justify-self-center" label="Список основних характеистик:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.characteristics)" class="col-span-2"
                label="Пусто" />

            <ObjectFieldsTable v-if="checkObjectFieldExisting(selected_character.characteristics)"
                :fields="selected_character.characteristics" :callback="updateCharacterCharacteristic" />

            <Header1 class="col-span-2 justify-self-center" label="Список фінансів:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.currency)" class="col-span-2" label="Пусто" />

            <CurrencyTable :currency_array="selected_character.currency" :callback="updateCurrency" />

        </div>

        <div id="custom" v-if="activeTab === 'custom'" class="grid grid-cols-2 auto-rows-min gap-4">

            <Header1 class="col-span-2 font-medium" label="Список кастомних полей:" />

            <Header1 v-if="!checkObjectFieldExisting(selected_character.customFields)" class="col-span-2"
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

        <div id="perks" v-if="activeTab === 'perks'" class="grid grid-cols-3 auto-rows-min gap-x-4 gap-y-3">

            <div class="w-full col-span-full flex gap-2 justify-center">

                <GraySelectorButton v-for="type in perkTypes" :label="type.name" :id="type.id" :active="!type.hidden"
                    @click="showPerkType(type.id)" />
            </div>

            <Header1 class="col-span-full justify-self-center" label="Перки персонажа: " />

            <div class="col-span-3 flex gap-2">
                <input v-model="characterPerksSearchQuery" placeholder="Пошук ..."
                    class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                <RejectButtonWithText v-if="characterPerksSearchQuery" @click="characterPerksSearchQuery = ''"
                    text="Очистити" />
            </div>

            <PerkRowView v-for="perk in getFilteredCharacterPerks(activePerkType)" :perk="perk" :removable="true"
                :callback_remove="removerPerk" />

            <Header1 class="col-span-full justify-self-center" label="Усі перки: " />

            <div class="col-span-3 flex gap-2">
                <input v-model="sessionPerksSearchQuery" placeholder="Пошук ..."
                    class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                <RejectButtonWithText v-if="sessionPerksSearchQuery" @click="sessionPerksSearchQuery = ''"
                    text="Очистити" />
            </div>

            <PerkRowView v-for="perk in getFilteredSessionPerks(activePerkType)" :perk="perk" :addable="true"
                :callback_add="addPerk" />

        </div>

        <div id="inventory" v-if="activeTab === 'inventory'" class="flex flex-col items-center gap-y-4">

            <div class="w-full flex gap-2 justify-center">
                <GraySelectorButton v-for="type in inventoryTypes" :label="type.name" :id="type.id"
                    :active="!type.hidden" @click="showEntityType(type.id)" />
            </div>

            <Header1 class="self-start" label="Інвентар персонажа:" />

            <div class="w-full flex flex-col gap-2">

                <div class="flex gap-2">

                    <input v-model="characterEntitySearchQuery" placeholder="Пошук ..."
                        class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                    <RejectButtonWithText v-if="characterEntitySearchQuery" @click="characterEntitySearchQuery = ''"
                        text="Очистити" />
                </div>

                <div class="w-full grid grid-cols-3 gap-2 max-h-[1024px] overflow-y-auto md:auto-hide-scroll">

                    <EntityRowView v-for="entity in getFilteredCharacterEntities(activeType)" :entity="entity"
                        :callback_add="addEntity" :callback_remove="removeEntity" />

                </div>
            </div>

            <Header1 class="self-start" label="Весь інвентар:" />

            <div class="w-full flex flex-col gap-2">

                <div class="flex gap-2">

                    <input v-model="sessionEntitySearchQuery" placeholder="Пошук ..."
                        class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                    <RejectButtonWithText v-if="sessionEntitySearchQuery" @click="sessionEntitySearchQuery = ''"
                        text="Очистити" />
                </div>

                <div class="w-full grid grid-cols-3 gap-2 max-h-[512px] overflow-y-auto md:auto-hide-scroll">

                    <EntityRowView v-for="entity in getFilteredSessionEntities(activeType)" :entity="entity"
                        :callback_add="addEntity" :callback_remove="removeEntity" />

                </div>
            </div>

        </div>

    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>