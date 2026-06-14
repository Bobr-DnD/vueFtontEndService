<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';
import { notify } from '@utils/notification';
import { toNewEntity, toObject, toNewSession } from '@utils/objects.dto';
import { checkObjectFieldExisting, addRow, removeRow } from '@utils/entityHelper';
import { socket } from '@ws/webSocket';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import EntityTile from '@/components/reusable/EntityTiles/EntityTile.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import DropDownChoosen from '@/components/reusable/DropDowns/DropDownChoosen.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import CustomFieldsEditor from '@/components/reusable/CustomFieldsEditor.vue';
import EffectTile from '@/components/reusable/EntityTiles/EffectTile.vue';

const state = reactive({
    session: {
        effects: [],
        entities: []
    },
    isLoading: true,
    unsavedChanges: false,
    selectedEntity: toNewEntity({})
})

const sessionId = useRoute().params.sessionId

const selectedType = ref('')
const searchQuery = ref('')
const searchQueryEffects = ref('')
const entityNewRequirement = ref({})

onMounted(async () => {
    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) return

    state.isLoading = false
    state.session = toNewSession(resSession.data)
})

onBeforeUnmount(() => {
    const events = ['session:updateNotify']
    events.forEach(e => socket.off(e))
})

socket.on('session:updateNotify', (session) => {
    state.session = toNewSession(session)
    notify({ message: `Сесію було оновлено майстром`, type: 'warning' })
})

const filteredEntities = computed(() => {

    let entities = toRaw(state.session.entities)

    if (selectedType.value) {
        entities = entities.filter(el => el.type === selectedType.value)
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        entities = entities.filter(el =>
            el.name.toLowerCase().includes(query)
        )
    }

    return entities
})

const filteredEffects = computed(() => {
    let effects = toRaw(state.session.effects)

    if (searchQueryEffects.value.trim()) {
        const query = searchQueryEffects.value.toLowerCase()

        effects = effects.filter(el =>
            el.name.toLowerCase().includes(query)
        )
    }

    return effects
})

async function saveEntity() {

    const entity = toRaw(state.selectedEntity)

    if (state.selectedEntity.id === 'new') {
        entity.session = sessionId

        const [res, err] = await asyncHandler(
            RepositoryFactory.create('entity', entity)
        )
        if (err) return

        state.selectedEntity = toNewEntity({ type: state.selectedEntity.type })
    }
    else {
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('entity', entity.id, entity)
        )
        if (err) return
    }

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return

    state.session = res.data
    state.unsavedChanges = false
    
    notify({ message: 'Зміни збережені', type: 'info' })
    socket.emit('session:updateNotify', sessionId)
}

async function deleteEntity() {

    const confirmSwitch = confirm('Видалити?')
        if (!confirmSwitch) return

    const [resEntity, errEntity] = await asyncHandler(
        RepositoryFactory.delete('entity', state.selectedEntity.id)
    )
    if (errEntity) return

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return

    state.session = res.data
    state.unsavedChanges = false
    state.selectedEntity = toNewEntity({ type: state.selectedEntity.type })

    notify({ message: 'Елемент видалено', type: 'info' })
    socket.emit('session:updateNotify', sessionId)
}

function discardChanges() {
    if (state.selectedEntity.id === 'new') state.selectedEntity = toNewEntity({})
    else state.selectedEntity = toNewEntity(structuredClone(toRaw(state.session.entities.find(el => el.id === state.selectedEntity.id))))

    state.unsavedChanges = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function markUnsaved() {
    state.unsavedChanges = true
}

function selectEntity(entity) {
    if (state.unsavedChanges) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    state.unsavedChanges = false
    state.selectedEntity = toNewEntity(structuredClone(toRaw(entity)))
    searchQueryEffects.value = ''
}

function updateEntityFields(field, value) {
    state.selectedEntity[field] = value
    markUnsaved()
}

function updateEntityType(id) {
    const type = state.session.entityTypes.find(el => el.id === id)
    state.selectedEntity.type = type.name
    if (state.selectedEntity.id !== 'new') markUnsaved()
}

function updateImage(image) {
    state.selectedEntity.image = image
    markUnsaved()
}

function addRequirement() {
    Object.assign(state.selectedEntity.requirement, toObject({ name: entityNewRequirement.value.type, value: entityNewRequirement.value.value }))
    markUnsaved()
}

function removeRequirement(key) {
    delete state.selectedEntity.requirement[key]
    markUnsaved()
}

function getRequirementType(id) {
    const type = state.session.characteristicsList.find(el => el.id === id)
    entityNewRequirement.value.type = type.name
}

function getRequirementValue(field, value) {
    entityNewRequirement.value.value = value
}

function addCharacteristic(name, value) {
    Object.assign(state.selectedEntity.characteristics, toObject({ name, value }))
    markUnsaved()
}

function removeCharacteristic(key) {
    delete state.selectedEntity.characteristics[key]
    markUnsaved()
}

function addEffect(id) {
    addRow(state.session.effects, state.selectedEntity.effects, id)
    markUnsaved()
}

function removeEffect(id) {
    removeRow(state.selectedEntity.effects, id)
    markUnsaved()
}

</script>


<template>

    <MasterPageNavigation />

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-2 items-center justify-start">
        <div class="w-full flex flex-wrap justify-center items-center gap-2 justify-self-start">

            <GraySelectorButton class="w-full basis-32" @click="selectedType = ''" id="all" label="Всі"
                :active="selectedType === '' ? true : false" />

            <GraySelectorButton class="w-full basis-32" v-for="type in state.session.entityTypes" :key="type.id"
                @click="selectedType = type.name" :id="type.id" :label="type.name"
                :active="selectedType === type.name ? true : false" />

        </div>

        <div>
            <SearchInputBlack v-model:searchQuery="searchQuery" />
        </div>

        <div class="grid grid-cols-4 gap-4 py-2 max-h-[512px] overflow-y-scroll auto-hide-scroll">
            <div @click="selectEntity({})"
                :class="state.selectedEntity.id === 'new' && 'bg-darkred-dark_gray text-darkred-light'"
                class="border-8 border-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                <PlusButton class="w-20" />
            </div>

            <EntityTile v-for="entity in filteredEntities" @click="selectEntity(entity)"
                :class="state.selectedEntity.id === entity.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                :entity="entity" />

        </div>

    </section>

    <section v-if="!state.isLoading" class="m-4 flex gap-2 items-center justify-start">

        <AprroveButtonWithText @click="saveEntity" text="Підтвердити"
            :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />

        <RejectButtonWithText v-if="state.selectedEntity.id !== 'new'" @click="deleteEntity" text="Видалити" />

        <RejectButtonWithText @click="discardChanges" text="Відминити"
            :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />

        <UnsavedLabel v-if="state.unsavedChanges" />
    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-4 gap-2 items-center justify-start">

        <Header1 class="col-span-full" label="Створити\Редагувати:" />

        <ImageEditor class="col-span-full" :image="state.selectedEntity.image" label="Картинка"
            :callback="updateImage" />

        <InputTextReactive class="col-span-3" placeholder="Назва" fieldName="name" v-model:inputValue="state.selectedEntity.name"
            :callback="updateEntityFields" type="text" :important="true" />

        <DropDownChoosen label="Тип" entity_name="EntityType" :entity_array="state.session.entityTypes"
            v-model:selected="state.selectedEntity.type" :callback="updateEntityType" />

        <InputTextReactive class="col-span-3" placeholder="Опис" fieldName="description" ,
            v-model:inputValue="state.selectedEntity.description" :callback="updateEntityFields" type="text" />

        <InputTextReactive placeholder="Ціна" fieldName="price" v-model:inputValue="state.selectedEntity.price"
            :callback="updateEntityFields" type="number" />

        <TextAreaReactive class="col-span-3" label="Записки Майстра" v-model:value="state.selectedEntity.notes" />

        <InputTextReactive placeholder="Рідкість" fieldName="rarity" v-model:inputValue="state.selectedEntity.rarity"
            :callback="updateEntityFields" type="text" />

        <div class="col-span-2 self-start flex gap-4 flex-wrap rounded-2xl border-x-4 border-darkred-dark_gray p-4">

            <Header1 class="shrink w-full" label="Харакетристики:" />

            <div v-if="checkObjectFieldExisting(state.selectedEntity.characteristics)"
                v-for="value, key in state.selectedEntity.characteristics"
                class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">

                <div>
                    {{ key }}: {{ value }}
                </div>

                <DeleteButton class="bg-darkred-red" @click="removeCharacteristic(key)" />
            </div>

            <div v-else>
                Пусто
            </div>


            <CustomFieldsEditor class="shrink w-full" name="entityCharacteristics"
                :fields="state.selectedEntity.characteristics" :callback="addCharacteristic" />

        </div>

        <div class="col-span-2 self-start flex gap-4 flex-wrap rounded-2xl border-x-4 border-darkred-dark_gray p-4">

            <Header1 class="shrink w-full" label="Вимоги:" />

            <div v-if="checkObjectFieldExisting(state.selectedEntity.requirement)"
                v-for="value, key in state.selectedEntity.requirement"
                class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">

                <div>
                    {{ key }}: {{ value }}
                </div>

                <DeleteButton class="bg-darkred-red" @click="removeRequirement(key)" />
            </div>

            <!-- <div v-if="checkObjectFieldExisting(state.session.characteristicsList)" class="shrink w-full mx-auto flex gap-2 items-center">
                <TextDropdown label="Характеристика" :entity_array="state.session.characteristicsList"
                    entity_name="entityCharacteristic" :callback="getRequirementType" />
                <InputTextReactive placeholder="Значення" fieldName="value" type="number"
                    :inputValue="entityNewRequirement.value" :callback="getRequirementValue" />
                <div class="pb-2 self-end">
                    <AprroveButtonWithText @click="addRequirement" text="Додати поле" />
                </div>

            </div>

            <div v-else> <Header2 label="В сесії відсутні характеристики"/></div> -->

        </div>

    </section>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-1 gap-2 items-center justify-start">
        <Header1 label="Ефекти:" />

        <div v-if="checkObjectFieldExisting(state.selectedEntity.effects)"
            class="grid grid-cols-3 gap-4 items-center justify-start">

            <div v-for="effect in state.selectedEntity.effects"
                class="bg-darkred-dark  p-2 rounded-2xl flex gap-4 items-center justify-between">

                <EffectTile :effect="effect" class="w-full" />

                <DeleteButton @click="removeEffect(effect.id)"
                    class="bg-darkred-red h-16 w-16 text-darkred-light text-2xl" />

            </div>

        </div>

        <div v-else>
            <Header2 label="Пусто" />
        </div>

        <SearchInputBlack v-model:searchQuery="searchQueryEffects" />

        <div class="max-h-[512px] overflow-y-scroll auto-hide-scroll grid grid-cols-4 gap-4 items-center justify-start">
            <EffectTile v-for="effect in filteredEffects" :effect="effect" @click="addEffect(effect.id)" />
        </div>

    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>