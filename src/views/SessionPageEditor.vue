<script setup>
import { reactive, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { asyncHandler } from '@utils/asyncHandler';
import { toNewSession, toObject } from '@utils/objects.dto';
import { notify } from '@utils/notification';
import RepositoryFactory from '@http/RepositoryFactory';
import { socket } from '@ws/webSocket';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import CustomFieldsEditor from '@/components/reusable/CustomFieldsEditor.vue';
import CustomFieldTile from '@/components/reusable/EntityTiles/CustomFieldTile.vue';
import ArrayStringFormWIcons from '@/components/reusable/Forms/ArrayStringFormWIcons.vue';
import ArrayStringFromWColorPicker from '@/components/reusable/Forms/ArrayStringFromWColorPicker.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const editedSession = ref()
const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Характеристики' },
    { id: 'types', label: "Типи об'єктів" }
]

onMounted(async () => {
    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    state.isLoading = false
    state.session = res.data
    copySession()
})

async function saveSession() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.update('session', editedSession.value.id, toRaw(editedSession.value))
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    state.session = res.data
    copySession()
    state.unsavedChanges = false

    notify({ message: 'Сесія оновлена', type: 'success' })
    socket.emit('session:updateNotify', res.data.id)
}

function markUnsaved() {
    state.unsavedChanges = true
}

function copySession(){
    editedSession.value = toNewSession(structuredClone(toRaw(state.session)))
}

function discardChanges() {
    copySession()
    state.unsavedChanges = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function updateSession(field, value) {
    editedSession.value[field] = value
    markUnsaved()
}

function addImage(image) {
    editedSession.value.image = image
    markUnsaved()
}

function addCustomField(object) {
    editedSession.value.customFields.push(object)
    markUnsaved();
}

function removeCustomField(id) {
    const index = editedSession.value.customFields.findIndex(f => f.id === id)
    if (index !== -1) editedSession.value.customFields.splice(index, 1)
    else notify({ message: 'Не знайдено поле для видалення', type: 'error' })

    markUnsaved();
}

function updateStringArray(field, array) {
    editedSession.value[field] = array
    markUnsaved()
}

watch(() => editedSession.value, (newValue) => {

    //fix it later to smth better
    if (JSON.stringify(toRaw(state.session.name)) !== JSON.stringify(toRaw(editedSession.value.name))) {
        markUnsaved()
    }

    if (JSON.stringify(toRaw(state.session.customFields)) !== JSON.stringify(toRaw(editedSession.value.customFields))) {
        markUnsaved()
    }
}, { deep: true })

</script>

<template>

    <MasterPageNavigation />

    <div v-if="!state.isLoading" class="grid grid-cols-[25%_1fr]">
        <section class="p-4 w-full flex flex-col justify-start gap-2 font-gothic">
            <GraySelectorButton v-for="tab in tabs" @click="activeTab = tab.id" :key="tab.id" :id="tab.id"
                :label="tab.label" :active="activeTab === tab.id ? true : false" />
            <AprroveButtonWithText @click="saveSession" class="w-full" text="Підтвердити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="state.unsavedChanges" />
        </section>

        <section class="m-4 p-2">
            <div v-if="activeTab === 'base'" class="grid grid-cols-2 gap-2">
                <ImageEditor class="w-full col-span-2" :image="editedSession.image" label="Session image"
                    :callback="addImage" />

                <InputTextReactive placeholder="Назва сесії" fieldName="Sessionname" type="text" :important="true"
                    v-model:inputValue="editedSession.name" />

                <TextAreaEditor class="col-span-2" fieldName="notes" name="Записки майстра" :value="editedSession.notes"
                    :callback="updateSession" />

                <Header1 class="col-span-2 font-medium" label="Список кастомних полей" />

                <div v-for="(field, index) in editedSession.customFields" :key="field.id">
                    <CustomFieldTile v-model:customField="editedSession.customFields[index]" :field_removable="true"
                        :callback_remove="removeCustomField" :callback_save="markUnsaved" />
                </div>

                <div class="col-span-2">
                    <CustomFieldsEditor name="customFields" :callback="addCustomField" />
                </div>

            </div>

            <div v-if="activeTab === 'types'" class="grid grid-cols-2 gap-4">
                <ArrayStringFormWIcons :array="editedSession.entityTypes" label="Інвентар" array_name="entityTypes"
                    :callback="updateStringArray" :set_icon="true" />

                <ArrayStringFormWIcons :array="editedSession.currencyTypes" label="Валюти" array_name="currencyTypes"
                    :callback="updateStringArray" :set_icon="true" />

                <ArrayStringFormWIcons :array="editedSession.characteristicsList" label="Характеристики"
                    array_name="characteristicsList" :callback="updateStringArray" />

                <ArrayStringFormWIcons :array="editedSession.enemyTypes" label="Вороги" array_name="enemyTypes"
                    :callback="updateStringArray" />

                <ArrayStringFormWIcons :array="editedSession.questTypes" label="Статуси квестів" array_name="questTypes"
                    :callback="updateStringArray" />

                <ArrayStringFromWColorPicker :array="editedSession.perkTypes" label="Типи перків" array_name="perkTypes"
                    :callback="updateStringArray" />

            </div>

        </section>
    </div>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>