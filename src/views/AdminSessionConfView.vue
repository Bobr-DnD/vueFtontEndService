<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory'
import Loader from 'vue-spinner/src/SyncLoader.vue'
import MasterPageNavigation from '@/components/MasterPageNavigation.vue';
import MasterPageMenu from '@/components/MasterPageMenu.vue';
import Armor from '@/components/Armor.vue';

const id = useRoute().params.id
const state = reactive({
    session: {},
    isLoading: true

})
const entities = ['characters', 'armors', 'enemies', 'inventories', 'medicines', 'perks', 'weapons', 'fractions', 'quests', 'session', 'effects'].sort()

let currency = ref([])
let fields = ref([])

onMounted(async () => {
    try {
        const res = await RepositoryFactory.getById('session', id)
        state.session = res.data

        currency = Object.entries(state.session.currency).map(([key]) => `${key}`)
        fields = Object.entries(state.session.customFields).map(([key]) => `${key}`)

    } catch (err) {
        console.error(err)
    }
    finally {
        state.isLoading = false
    }
})
</script>

<template>
    <MasterPageNavigation />
    <div v-if="!state.isLoading" class="flex">
        <main class="w-full">
            <div class="mt-4 mb-4">
                <Armor class="col-start-1" v-model:armors="state.session.armors" />
            </div>
            <div class="grid grid-cols-2 justify-items-center">
                <div v-for="i in 4" :key="i">{{ i }} texts</div>
            </div>

        </main>
        <MasterPageMenu :session_name="state.session.name" :session_image="''" :entities="entities" />
    </div>

    <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <Loader />
    </div>
</template>


<style scoped></style>
