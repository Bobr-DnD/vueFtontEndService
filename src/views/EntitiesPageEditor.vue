<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { notify } from '/utils/notification';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';

const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId

const selected_entity = ref({})

const tabs = [
    { id: 'perk', label: 'Перки' },
    { id: 'weapon', label: 'Зброя' },
    { id: 'armor', label: 'Броня' },
    { id: 'medicine', label: 'Хілки' },
    { id: 'inventory', label: 'Інвентар' }
]

onMounted(async () => {
    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) {
        console.warn(notify({ message: errSession.message, type: 'error' }))
        return
    }

    state.isLoading = false
    state.session = resSession.data
})

</script>


<template>

    <MasterPageNavigation />

    <div class="m-4 grid grid-cols-[150px_1fr] gap-2 items-center justify-start">
        <div v-if="!state.isLoading" class="w-full flex flex-col items-center gap-2 justify-self-start justify-center">
            <GraySelectorButton class="w-full" v-for="tab in tabs" @click="selected_entity = tab.id" :id="tab.id" :label="tab.label"
                :active="selected_entity === tab.id ? true : false" />

            <!-- <AprroveButtonWithText @click="saveCharacter" class="w-full" text="Підтвердити"
                :class="[!state.unsavedChanges && 'pointer-events-none opacity-50']" />
            <RejectButtonWithText @click="discardChanges" class="w-full" text="Відминити"
                :class="[!canSave && 'pointer-events-none opacity-50']" />
            <UnsavedLabel v-if="state.unsavedChanges" /> -->
        </div>
    </div>



    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>