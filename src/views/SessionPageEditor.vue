<script setup>
import { reactive, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { asyncHandler } from '@utils/asyncHandler';
import { toNewSession } from '@utils/objects.dto';
import { notify } from '@utils/notification';
import RepositoryFactory from '@http/RepositoryFactory';
import { socket } from '@ws/webSocket';
import { useRouter } from 'vue-router'
import { checkEqualByKeys } from '@utils/entityHelper';

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

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const router = useRouter()

const oldPass = ref('')
const newPass = ref('')
const confirmPass = ref('')
const canChange = ref(false)

const sessionId = useRoute().params.sessionId
const editedSession = ref()
const activeTab = ref('base')

const copied = ref(false)

const tabs = [
    { id: 'base', label: 'Характеристики' },
    { id: 'types', label: "Типи об'єктів" },
    { id: 'security', label: 'Зміна пароля' }
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

async function changePassword() {
    const validationErrors = validatePasses()

    if (validationErrors.length > 0) {
        validationErrors.forEach(error => notify({ message: error, type: 'error' }))
        return
    }

    const [res, err] = await asyncHandler(
        RepositoryFactory.changepass('session', sessionId, { password: toRaw(oldPass.value), passwordNew: toRaw(newPass.value) })
    )

    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }
    else if (res.data.success) notify({ message: res.data.message, type: 'success' })

    clearPasses()
    return
}

async function deleteSession() {

    const confirmSwitch = confirm('Видалити сесію?')
    if (!confirmSwitch) return

    const [res, err] = await asyncHandler(
        RepositoryFactory.delete('session', sessionId)
    )
    if (err) return
    else if (res.data.status) notify({ message: 'Сесію видалено', type: 'success' })
    router.push('/')
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

function markUnsaved() {
    state.unsavedChanges = true
}

function copySession() {
    editedSession.value = toNewSession(structuredClone(toRaw(state.session)))
    copied.value = true
}

function discardChanges() {
    copySession()
    state.unsavedChanges = false
    notify({ message: 'Зміни анульовані', type: 'warning' })
}

function addCustomField(object) {
    editedSession.value.customFields.push(object)
    markUnsaved();
}

function removeCustomField(id) {
    editedSession.value.customFields = editedSession.value.customFields.filter(el => el.id !== id)
    markUnsaved();
}

const keysToWatch = [
    'name',
    'image',
    'notes',
    'customFields',
    'entityTypes',
    'currencyTypes',
    'characteristicsList',
    'enemyTypes',
    'questTypes',
    'perkTypes',
]

watch(() => editedSession.value, () => {

    if (copied.value) {
        copied.value = false
        return
    }

    if (checkEqualByKeys(state.session, editedSession.value, keysToWatch)) markUnsaved()

}, { deep: true, immediate: false })

watch([oldPass, newPass, confirmPass], () => {
    if (oldPass.value.length !== 0 && newPass.value.length !== 0 && confirmPass.value.length !== 0)
        canChange.value = true
})

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
                <ImageEditor class="w-full col-span-2" v-model:image="editedSession.image" label="Session image" />

                <InputTextReactive placeholder="Назва сесії" fieldName="Sessionname" type="text" :important="true"
                    v-model:inputValue="editedSession.name" />

                <TextAreaReactive class="col-span-2" label="Записки майстра" v-model:value="editedSession.notes" />

                <Header1 class="col-span-2 font-medium" label="Список кастомних полей" />

                <div v-for="(field, index) in editedSession.customFields" :key="field.id">
                    <CustomFieldTile v-model:customField="editedSession.customFields[index]" :field_removable="true"
                        :callback_remove="removeCustomField" />
                </div>

                <div class="col-span-2">
                    <CustomFieldsEditor name="customFields" :callback="addCustomField" />
                </div>

            </div>

            <div v-if="activeTab === 'types'" class="grid grid-cols-2 gap-4">

                <ArrayStringFormWIcons v-model:array="editedSession.entityTypes" label="Інвентар" :setIcon="true" />

                <ArrayStringFormWIcons v-model:array="editedSession.currencyTypes" label="Валюти" :setIcon="true" />

                <ArrayStringFormWIcons v-model:array="editedSession.characteristicsList" label="Характеристики" />

                <ArrayStringFormWIcons v-model:array="editedSession.enemyTypes" label="Вороги" />

                <ArrayStringFormWIcons v-model:array="editedSession.questTypes" label="Статуси квестів" />

                <ArrayStringFromWColorPicker v-model:array="editedSession.perkTypes" label="Типи перків" />

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

                    <RejectButtonWithText text="Видалити сесію" @click="deleteSession" />
                </div>

            </div>

        </section>
    </div>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>