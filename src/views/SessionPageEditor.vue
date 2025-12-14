<script setup>
import { reactive, onMounted, ref, computed, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { asyncHandler } from '@utils/asyncHandler';
import { toNewSession, toCustomFieldObjectField } from '@utils/objects.dto';
import { notify } from '@utils/notification';
import { iconsList } from '@utils/icons'
import RepositoryFactory from '@http/RepositoryFactory';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';
import ObjectFieldsTable from '@/components/reusable/ObjectFieldsTable.vue';
import ArrayStringForm from '@/components/reusable/ArrayStringForm.vue';
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
    editedSession.value = toNewSession(state.session)
})

async function saveSession() {
    const [res, err] = await asyncHandler(
        RepositoryFactory.update('session', editedSession.value.id, editedSession.value)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    state.session = res.data
    editedSession.value = toNewSession(state.session)
    state.unsavedChanges = false

    notify({ message: 'Сесія оновлена', type: 'success' })
}

function markUnsaved() {
    state.unsavedChanges = true
}

function discardChanges() {
    editedSession.value = toNewSession(state.session)
    state.unsavedChanges = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function updateSession(field, value) {
    editedSession.value[field] = value
    markUnsaved()
}

function addImage(image) {
    state.session.value.image = image
    markUnsaved()
}

function addCustomField(name, value) {
    Object.assign(editedSession.value.customFields, toCustomFieldObjectField({ name, value }))
    markUnsaved();
}

function updateCustomFields(fields) {
    editedSession.value.customFields = fields
    markUnsaved();
}

function updateStringArray(field, array) {
    editedSession.value[field] = array
    console.log(editedSession.value[field]);

    markUnsaved()
    console.log(editedSession.value[field]);
}


</script>

<template>

    <MasterPageNavigation />

    <div class="grid grid-cols-[25%_1fr]">
        <section class="p-4 w-full flex flex-col justify-start gap-2 font-gothic">
            <GraySelectorButton v-for="tab in tabs" @click="activeTab = tab.id" :key="tab.id" :id="tab.id"
                :label="tab.label" :active="activeTab === tab.id ? true : false" />
            <AprroveButtonWithText @click="saveSession" class="w-full" text="Підтвердити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="state.unsavedChanges" />
        </section>

        <section v-if="!state.isLoading" class="m-4 p-2">
            <div v-if="activeTab === 'base'" class="grid grid-cols-2 gap-2">
                <ImageEditor class="w-full col-span-2" :image="editedSession.image" label="Session image"
                    :callback="addImage" />

                <SingleFieldEditor :value="editedSession.name" placeholder="Назва сесії" fieldName="name"
                    :callback="updateSession" type="text" />

                <!-- <SingleFieldEditor :value="editedSession.move" placeholder="Хід" fieldName="move"
                    :callback="updateSession" type="number" /> -->

                <TextAreaEditor class="col-span-2" fieldName="adminNotes" name="Записки майстра"
                    :value="editedSession.adminNotes" :callback="updateSession" />

                <Header1 class="col-span-2 font-medium" label="Список кастомних полей" />

                <ObjectFieldsTable :field_removable="true" :fields="editedSession.customFields"
                    :callback="updateCustomFields" />


                <div class="col-span-2">

                    <ObjectFieldsEditor name="customFields" :fields="editedSession.customFields"
                        :callback="addCustomField" />
                </div>

            </div>

            <div v-if="activeTab === 'types'" class="grid grid-cols-2 gap-4">
                <ArrayStringForm :array="editedSession.entityTypes" label="Інвентар" array_name="entityTypes"
                    :callback="updateStringArray" :set_icon="true" />

                <ArrayStringForm :array="editedSession.currencyTypes" label="Валюти" array_name="currencyTypes"
                    :callback="updateStringArray" :set_icon="true" />

                <ArrayStringForm :array="editedSession.characteristicsList" label="Характеристики"
                    array_name="characteristicsList" :callback="updateStringArray" :set_icon="false" />

                <ArrayStringForm :array="editedSession.enemyTypes" label="Вороги" array_name="enemyTypes"
                    :callback="updateStringArray" :set_icon="false" />

            </div>

        </section>
    </div>




    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>