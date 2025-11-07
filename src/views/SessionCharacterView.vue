<script setup>
import Loader from 'vue-spinner/src/SyncLoader.vue'
import { reactive, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import PlusButton from '@/components/reusable/PlusButton.vue'
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import CustomFieldsTable from '@/components/reusable/CustomFieldsTable.vue';
import ObjectFieldsEditor from '@/components/reusable/ObjectFieldsEditor.vue';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';

const state = reactive({
    session: {},
    isLoading: true
})

const sessionId = useRoute().params.sessionId
let selected_character = ref({ id: 'empty' })

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
})

function selectCharacter(character) {
    selected_character.value = character
}

async function updateCharacter(field, value) {
    selected_character.value[field] = value
    console.log(selected_character.value);
}

function checkObjectFieldExisting(field){
    return (field !== undefined && field !== null)
}

</script>


<template>

    <MasterPageNavigation />

    <div v-if="!state.isLoading" class="flex items-center justify-center space-x-4 m-2">
        <div class="p-2 border-4 border-darkred-dark_gray  rounded-lg text-3xl font-gothic hover:bg-darkred-gray hover:cursor-pointer"
            :class="selected_character.id === character.id ? 'bg-darkred-gray' : 'bg-darkred-light'"
            v-for="character in state.session.characters" @click="selectCharacter(character)">{{ character.name }}</div>
        <PlusButton @click="selectCharacter({ id: 'empty' })" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg hover:cursor-pointer
           hover:bg-darkred-gray relative overflow-hidden group"
            :class="selected_character.id === 'empty' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
    </div>

    <section v-if="!state.isLoading" class="m-4 grid grid-cols-[25%_75%] gap-2">

        <div>
            <ImageEditor class="w-full mt-4" />
            <TextAreaEditor fieldName="playerNotes" name="Записки гравця" :value="selected_character.playerNotes"
                :callback="updateCharacter" />
            <TextAreaEditor fieldName="adminNotes" name="Записки майстра" :value="selected_character.adminNotes"
                :callback="updateCharacter" />
        </div>

        <div class="grid grid-cols-2 auto-rows-min gap-x-4">

            <SingleFieldEditor placeholder="Ім'я" fieldName="name" :value="selected_character.name"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Стать" fieldName="gender" :value="selected_character.gender"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Клас" fieldName="class" :value="selected_character.class"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Раса" fieldName="race" :value="selected_character.race"
                :callback="updateCharacter" class="w-full" />
            <SingleFieldEditor placeholder="Рівень" fieldName="level" :value="selected_character.level"
                :callback="updateCharacter" type="number" class="w-full" />
            <SingleFieldEditor placeholder="Очки перків" fieldName="perkPoints" :value="selected_character.perkPoints"
                :callback="updateCharacter" type="number" class="w-full" />
            <SingleFieldEditor placeholder="Досвід" fieldName="experience" :value="selected_character.experience"
                :callback="updateCharacter" type="number" class="w-full" />
            <SingleFieldEditor placeholder="К-сть досвіду для рівня" fieldName="experienceToLevelUp"
                :value="selected_character.experienceToLevelUp" :callback="updateCharacter" type="number"
                class="w-full" />
            <ObjectFieldsEditor :name="'CustomFields'"/>
        </div>

    </section>

    

    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>