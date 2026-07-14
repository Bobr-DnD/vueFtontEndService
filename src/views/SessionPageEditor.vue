<script setup>
import {  ref, toRaw, watch } from 'vue';
import { useSessionStore } from '@/stores/sessionStore';
import { useRoute } from 'vue-router';
import { notify } from '@utils/notification';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import CustomFieldsEditor from '@/components/reusable/CustomFieldsEditor.vue';
import CustomFieldTile from '@/components/reusable/EntityTiles/CustomFieldTile.vue';
import ArrayStringFormWIcons from '@/components/reusable/Forms/ArrayStringFormWIcons.vue';
import ArrayStringFromWColorPicker from '@/components/reusable/Forms/ArrayStringFromWColorPicker.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import InputPassword from '@/components/reusable/Inputs/InputPassword.vue';

const store = useSessionStore()
const sessionId = useRoute().params.sessionId

const oldPass = ref('')
const newPass = ref('')
const confirmPass = ref('')
const canChange = ref(false)

const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Характеристики' },
    { id: 'types', label: "Типи об'єктів" },
    { id: 'security', label: 'Зміна пароля' }
]

async function changePassword() {
        const validationErrors = validatePasses(newPass.value, confirmPass.value)

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => notify({ message: error, type: 'error' }))
            return
        }

        await store.changePassword(sessionId, toRaw(newPass.value), toRaw(oldPass.value))

        clearPasses()
        return
    }

function validatePasses() {
    const errors = []

    if (newPass.value.trim().length < 8) {
        errors.push('Мінімальна довжина пароля - 8 символів')
    }

    if (newPass.value !== confirmPass.value) {
        errors.push('Паролі не співпадають')
    }

    return errors
}

function clearPasses() {
    oldPass.value = ''
    newPass.value = ''
    confirmPass.value = ''
}

watch([oldPass, newPass, confirmPass], () => {
    if (oldPass.value.length !== 0 && newPass.value.length !== 0 && confirmPass.value.length !== 0)
        canChange.value = true
})

</script>

<template>

    <MasterPageNavigation />

    <div v-if="!store.isLoading" class="grid grid-cols-[25%_1fr] overflow-hidden">
        
        <section class="p-4 w-full flex flex-col justify-start gap-2 font-gothic overflow-y-auto">
            <GraySelectorButton v-for="tab in tabs" @click="activeTab = tab.id" :key="tab.id" :id="tab.id"
                :label="tab.label" :active="activeTab === tab.id ? true : false" />
            <AprroveButtonWithText @click="store.saveSession(sessionId)" class="w-full" text="Зберегти зміни"
                :class="[!store.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="store.discardChanges(sessionId)" class="w-full" text="Відминити зміни"
                :class="[!store.unsavedChanges && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="store.unsavedChanges" />
        </section>

        <section class="m-4 p-2 overflow-y-auto">
            <div v-if="activeTab === 'base'" class="grid grid-cols-2 gap-2">
                <ImageEditor class="w-full col-span-2" v-model:image="store.editedSession.image" label="Session image" />

                <InputTextReactive class="col-span-full" placeholder="Назва сесії" fieldName="Sessionname" type="text" :important="true"
                    v-model:inputValue="store.editedSession.name" />

                <TextAreaReactive class="col-span-2" label="Записки майстра" v-model:value="store.editedSession.notes" />

                <!-- <Header1 class="col-span-2 font-medium" label="Список кастомних полей" />

                <div v-for="(field, index) in store.editedSession.customFields" :key="field.id">
                    <CustomFieldTile v-model:customField="store.editedSession.customFields[index]" :field_removable="true"
                        :callback_remove="store.removeCustomField" />
                </div>

                <div class="col-span-2">
                    <CustomFieldsEditor name="customFields" :callback="store.addCustomField" />
                </div> -->

            </div>

            <div v-if="activeTab === 'types'" class="grid grid-cols-2 gap-4">

                <ArrayStringFormWIcons v-model:array="store.editedSession.entityTypes" label="Інвентар" :setIcon="true" />

                <ArrayStringFormWIcons v-model:array="store.editedSession.currencyTypes" label="Валюти" :setIcon="true" />

                <ArrayStringFormWIcons v-model:array="store.editedSession.characteristicsList" label="Характеристики" />

                <ArrayStringFromWColorPicker v-model:array="store.editedSession.perkTypes" label="Типи перків" />

            </div>

            <div v-if="activeTab === 'security'" class="grid grid-cols-2 gap-4">

                <div class="grid grid-cols-1 gap-4 w-[512px]">

                    <Header1 label="Змінити пароль:" />

                    <form @submit.prevent @keyup.enter="changePassword" class="flex flex-col gap-2">
                        <InputPassword v-model:passString="oldPass" />
                        <InputPassword :new="true" v-model:passString="newPass" />
                        <InputPassword :confirm="true" v-model:passString="confirmPass" />
                    </form>

                    <AprroveButtonWithText text="Змінити пароль" @click="changePassword"
                        :class="[!canChange && 'pointer-events-none opacity-50']" />

                    <RejectButtonWithText text="Видалити сесію" @click="store.deleteSession(sessionId)" />
                </div>

            </div>

        </section>
    </div>

    <div v-if="store.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>