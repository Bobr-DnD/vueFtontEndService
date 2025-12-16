<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import RepositoryFactory from '@http/RepositoryFactory'
import { asyncHandler } from '@utils/asyncHandler'
import { notify } from '@utils/notification'

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue'
import EffectTile from '@/components/reusable/EntityTiles/EffectTile.vue'
import Loader from 'vue-spinner/src/SyncLoader.vue'
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue'


const state = reactive({
    session: {},
    isLoading: true,
    unsavedChanges: false
})

const sessionId = useRoute().params.sessionId
const searchQuery = ref('')
const filteredEffects = ref([])

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
})

filteredEffects.value.effects = computed(() => {

    if (!searchQuery.value.trim()) return state.session.effects
    const query = searchQuery.value.toLowerCase()
    return state.session.effects.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})


</script>

<template>

    <MasterPageNavigation />

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-4 gap-4">

        <div class="flex gap-2 col-span-4">

            <input v-model="searchQuery" placeholder="Пошук ..."
                class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

            <RejectButtonWithText v-if="searchQuery" @click="searchQuery = ''"
                text="Очистити" />
        </div>

        <EffectTile v-for="effect in filteredEffects.effects" :effect="effect" />
        
    </section>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>


</template>