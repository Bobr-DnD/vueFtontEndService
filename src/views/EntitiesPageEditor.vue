<script setup>
import { ref, computed, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';
import { socket } from '@ws/webSocket'
import { notify } from '@utils/notification';
import { toNewEntity, toObject } from '@utils/objects.dto';
import { checkArrayFieldExisting, checkObjectFieldExisting, addRow, removeRow } from '@utils/entityHelper';
import { useSessionStore } from '@/stores/sessionStore';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import EntityTile from '@/components/reusable/EntityTiles/EntityTile.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import DropDownChoosen from '@/components/reusable/DropDowns/DropDownChoosen.vue';
import DropDownList from '@/components/reusable/DropDowns/DropDownList.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import EffectTile from '@/components/reusable/EntityTiles/EffectTile.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';

const sessionId = useRoute().params.sessionId
const store = useSessionStore()
const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Список речей' },
    { id: 'edit', label: "Створити/Редагувати річ" }
]

const newCharacteristic = ref({
    name: '',
    value: ''
})
const newRequirement = ref({
    name: '',
    value: ''
})
const selectedType = ref('')
const searchQuery = ref('')
const searchQueryEffects = ref('')
const selectedEntity = ref(toNewEntity({}))
const unsavedChanges = ref(false)
const copied = ref(false)

//Filtering

const filteredEntities = computed(() => {

    let entities = toRaw(store.session.entities)

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
    let effects = toRaw(store.session.effects)

    if (searchQueryEffects.value.trim()) {
        const query = searchQueryEffects.value.toLowerCase()

        effects = effects.filter(el =>
            el.name.toLowerCase().includes(query)
        )
    }

    return effects
})

//API

async function saveEntity() {

    const entity = toRaw(selectedEntity.value)

    if (entity.id === 'new') {
        entity.session = sessionId

        const [res, err] = await asyncHandler(
            RepositoryFactory.create('entity', entity)
        )
        if (err) return
        reloadEntity('new')
    }
    else {
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('entity', entity.id, entity)
        )
        if (err) return
        reloadEntity(res.data.id)
    }
    notify({ message: 'Зміни збережені', type: 'info' })
    socket.emit('session:updateDataNotify', sessionId);
}

async function deleteEntity() {

    const confirmSwitch = confirm('Видалити?')
    if (!confirmSwitch) return

    const [res, err] = await asyncHandler(
        RepositoryFactory.delete('entity', selectedEntity.value.id)
    )
    if (err) return

    socket.emit('session:updateDataNotify', sessionId);
    notify({ message: 'Елемент видалено', type: 'info' })
    reloadEntity('new')
}

//service functions

function discardChanges() {
    markSaved()

    if (selectedEntity.value.id === 'new') selectedEntity.value = toNewEntity({})
    else selectedEntity.value = toNewEntity(structuredClone(toRaw(store.session.entities.find(el => el.id === selectedEntity.value.id))))

    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function markUnsaved() {
    unsavedChanges.value = true
}

function markSaved() {
    unsavedChanges.value = false
    copied.value = true
}

function reloadEntity(id, data = {id}){
    markSaved()

    if (id === 'new') selectedEntity.value = toNewEntity({})
    else selectedEntity.value = toNewEntity(data)
}

function selectEntity(id) {
    if (selectedEntity.value?.id === id) return
    if (unsavedChanges.value) {
        const confirmSwitch = confirm('Є незбережені зміни. Вийти без збереження?')
        if (!confirmSwitch) return
    }

    markSaved()

    if (id === 'new') selectedEntity.value = toNewEntity({})
    else selectedEntity.value = toNewEntity(structuredClone(toRaw(store.session.entities.find(el => el.id === id))))

    searchQueryEffects.value = ''
    activeTab.value = 'edit'
}

// Entity functions

function addEffect(id) {
    addRow(store.session.effects, selectedEntity.value.effects, id)
}

function removeEffect(id) {
    removeRow(selectedEntity.value.effects, id)
}

watch(() => selectedEntity.value, () => {

    if (copied.value) {
        copied.value = false
        return
    }
    markUnsaved()
}, { deep: true, immediate: false })

</script>


<template>

    <MasterPageNavigation />

    <section v-if="!store.isLoading"
        class="p-2 grid grid-cols-[25%_1fr] gap-2 items-center justify-start overflow-hidden font-gothic">

        <section class="p-2 w-full h-full font-gothic overflow-y-auto space-y-2">

            <div class="w-full flex flex-col gap-2">

                <GraySelectorButton class="w-full" v-for="type in tabs" :key="type.id" @click="activeTab = type.id"
                    :id="type.id" :label="type.label" :active="activeTab === type.id ? true : false" />

            </div>

            <div v-if="activeTab === 'edit'" class="w-full flex flex-col gap-2">

                <AprroveButtonWithText @click="saveEntity" text="Зберегти зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />


                <RejectButtonWithText @click="discardChanges" text="Відмінити зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />

                <RejectButtonWithText v-if="selectedEntity.id !== 'new'" @click="deleteEntity" text="Видалити"
                    class="w-full" />

                <UnsavedLabel v-if="unsavedChanges" class="w-full" />
            </div>

        </section>

        <section v-if="activeTab === 'base'" class="space-y-2 h-full overflow-y-auto">

            <div class="w-full flex flex-wrap justify-center items-center gap-2 justify-self-start">

                <GraySelectorButton class="w-full basis-32" @click="selectedType = ''" id="all" label="Всі"
                    :active="selectedType === '' ? true : false" />

                <GraySelectorButton class="w-full basis-32" v-for="type in store.session.entityTypes" :key="type.id"
                    @click="selectedType = type.id" :id="type.id" :label="type.name"
                    :active="selectedType === type.id ? true : false" />

            </div>

            <div class="flex justify-center">
                <SearchInputBlack v-model:searchQuery="searchQuery" class="w-1/2" />
            </div>

            <div class="grid grid-cols-4 gap-4 p-2 max-h-[512px]">

                <div @click="selectEntity('new')"
                    :class="selectedEntity.id === 'new' && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                    class="border-8 border-darkred-dark bg-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                    <PlusButton class="w-20 text-darkred-light" />
                </div>

                <EntityTile v-for="entity in filteredEntities" @click="selectEntity(entity.id)" :key="entity.id"
                    :class="selectedEntity.id === entity.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                    :entity="entity" />

            </div>

        </section>

        <section v-if="activeTab === 'edit'" class="h-full overflow-y-auto">

            <section class="m-4 grid grid-cols-4 gap-2 items-center justify-start">

                <!-- <ImageEditor class="col-span-full" label="Картинка" v-model:image="selectedEntity.image" /> -->

                <InputTextReactive class="col-span-3" placeholder="Назва Речі" fieldName="EntityName" type="text"
                    :important="true" v-model:inputValue="selectedEntity.name" />

                <DropDownChoosen label="Тип" entity_name="EntityType" :entity_array="store.session.entityTypes"
                    :important="true" v-model:selected="selectedEntity.type" />

                <InputTextReactive class="col-span-3" placeholder="Опис" fieldName="description" ,
                    v-model:inputValue="selectedEntity.description" type="text" />

                <InputTextReactive placeholder="Ціна" fieldName="price" v-model:inputValue="selectedEntity.price"
                    type="number" />

                <TextAreaReactive class="col-span-3" label="Записки Майстра" v-model:value="selectedEntity.notes" />

                <InputTextReactive placeholder="Рідкість" fieldName="rarity" v-model:inputValue="selectedEntity.rarity"
                    type="text" />

                <div
                    class="col-span-2 self-start flex gap-4 flex-wrap rounded-2xl border-2 border-darkred-light_gray p-4 mx-2">

                    <Header2 class="shrink w-full" label="Харакетристики:" />

                    <div v-if="checkObjectFieldExisting(selectedEntity.characteristics)"
                        v-for="value, key in selectedEntity.characteristics" :key="Math.random().toString(24).slice(2)"
                        class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">

                        <div>
                            {{ key }}: {{ value }}
                        </div>

                        <DeleteButton class="bg-darkred-red" @click="delete selectedEntity.characteristics[key]" />
                    </div>

                    <div class="shrink w-full" v-else>
                        Пусто
                    </div>

                    <div class="w-full grid grid-cols-1 gap-2 ">

                        <InputTextReactive v-model:inputValue="newCharacteristic.name" placeholder="Значення"
                            fieldName="CharacteristicValue" />

                        <InputTextReactive v-model:inputValue="newCharacteristic.value" placeholder="Значення"
                            fieldName="CharacteristicValue" />

                        <AprroveButtonWithText class="flex justify-center items-center text-lg"
                            @click="Object.assign(selectedEntity.characteristics, toObject(toRaw(newCharacteristic)))"
                            text="Додати характеристику" />
                    </div>

                </div>

                <div
                    class="col-span-2 self-start flex gap-4 flex-wrap rounded-2xl border-2 border-darkred-light_gray p-4 mx-2">

                    <Header2 class="shrink w-full" label="Вимоги:" />

                    <div v-if="checkObjectFieldExisting(selectedEntity.requirement)"
                        v-for="value, key in selectedEntity.requirement" :key="Math.random().toString(24).slice(2)"
                        class="flex gap-3 items-center p-3 w-fit rounded-lg bg-darkred-dark text-darkred-light">

                        <div>
                            {{ key }}: {{ value }}
                        </div>

                        <DeleteButton class="bg-darkred-red" @click="delete selectedEntity.requirement[key]" />
                    </div>

                    <div class="shrink w-full" v-else>
                        Пусто
                    </div>

                    <div class="w-full grid grid-cols-1 gap-2 ">

                        <DropDownList v-model:selected="newRequirement.name" label="Виберіть характеристику"
                            entity_name="CharacteristicName" :entity_array="store.session.characteristicsList" />

                        <InputTextReactive v-model:inputValue="newRequirement.value" placeholder="Значення"
                            fieldName="CharacteristicValue" />

                        <AprroveButtonWithText class="flex justify-center items-center text-lg"
                            @click="Object.assign(selectedEntity.requirement, toObject(toRaw(newRequirement)))"
                            text="Додати вимогу" />
                    </div>

                </div>

            </section>

            <section class="m-4 grid grid-cols-1 gap-2 items-center justify-start">
                <Header1 label="Ефекти:" />

                <div v-if="checkArrayFieldExisting(selectedEntity.effects)"
                    class="grid grid-cols-3 gap-4 items-center justify-start">

                    <div v-for="effect in selectedEntity.effects" :key="Math.random().toString(24).slice(2)"
                        class="bg-darkred-dark  p-2 rounded-2xl flex gap-4 items-center justify-between">

                        <EffectTile :effect="effect" class="w-full" />

                        <DeleteButton @click="removeEffect(effect.id)"
                            class="bg-darkred-red h-16 w-16 text-darkred-light text-2xl" />

                    </div>
                </div>

                <div v-else>
                    <Header2 label="Пусто" />
                </div>

                <SearchInputBlack v-model:searchQuery="searchQueryEffects" class="w-1/2 justify-self-center" />

                <div
                    class="max-h-[512px] overflow-y-auto auto-hide-scroll grid grid-cols-4 gap-4 items-center justify-start">
                    <EffectTile v-for="effect in filteredEffects" :key="effect.id" :effect="effect" @click="addEffect(effect.id)" />
                </div>

            </section>

        </section>
    </section>

    <div v-if="store.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>