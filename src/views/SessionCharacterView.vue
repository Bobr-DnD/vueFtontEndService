<script setup>
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { reactive, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import PlusButton from '@/components/reusable/PlusButton.vue';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';

const state = reactive({
    session: {},
    isLoading: true
})

const sessionId = useRoute().params.sessionId
let selected_character = ref({})

onMounted(async () => {
    const [resSession, errSession] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (errSession) {
        console.warn(errSession.message)
        return
    }
    else state.isLoading = false

    state.session = resSession.data
    selected_character.value = state.session.characters[0]
    console.log(selected_character.value);

})

function selectCharacter(character) {
    selected_character.value = character
    
}


</script>


<template>

    <MasterPageNavigation />

    <div class="flex items-center justify-center space-x-4 m-2">
        <div class="p-2 border-4 border-darkred-dark_gray  rounded-lg text-3xl font-gothic hover:bg-darkred-gray hover:cursor-pointer"
            :class="selected_character.id === character.id ? 'bg-darkred-gray' : 'bg-darkred-light'"
            v-for="character in state.session.characters" @click="selectCharacter(character)">{{ character.name }}</div>
        <PlusButton @click="selectCharacter({id: 'empty'})" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg hover:cursor-pointer
           hover:bg-darkred-gray relative overflow-hidden group"
            :class="selected_character.id === 'empty' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
    </div>

    <div>
        
    </div>

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>