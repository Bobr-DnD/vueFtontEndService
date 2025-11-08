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
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';
import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import EffectsTableAdmin from '@/components/admin-page components/EffectsTableAdmin.vue';
import { CheckBadgeIcon, ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon} from '@heroicons/vue/24/solid'
import HideTittle from '@/components/reusable/HideTittle.vue';
import WeaponRow from '@/components/character-page components/WeaponRow.vue';
import ArmorRow from '@/components/character-page components/ArmorRow.vue';
import MedsRow from '@/components/character-page components/MedsRow.vue';
import InventoryRow from '@/components/character-page components/InventoryRow.vue';
import PerkRow from '@/components/character-page components/PerkRow.vue';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { checkObjectFieldExisting } from '/utils/entityHelper';
import { toCustomFieldObjectField } from '/utils/objects.dto';

const state = reactive({
    session: {},
    isLoading: true
})

const sessionId = useRoute().params.sessionId
let selected_character = ref({ id: 'empty' })
const activeTab = ref('base')

const tabs = [
    { id: 'base', label: 'Базові характеристики' },
    { id: 'main', label: 'Головні характеристики' },
    { id: 'health', label: "Здоров'я" },
    { id: 'inventory', label: 'Інвентар' },
    { id: 'effects', label: 'Ефекти' },
    { id: 'image', label: 'Картинка' }
]

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

async function updateCharacterCharacteristic(fields) {
    selected_character.characteristics = fields
}

async function addCharacterCharacteristic(name, value) {
    if (selected_character.value.characteristics) Object.assign(selected_character.value.characteristics, toCustomFieldObjectField({ name, value }))
    else {
        selected_character.value.characteristics = {} //TODO refactor later
        Object.assign(selected_character.value.characteristics, toCustomFieldObjectField({ name, value }))
    }
}

async function updateCustomFields(fields) {
    selected_character.customFields = fields
}

async function addCustomField(name, value) {
    if (selected_character.value.customFields) Object.assign(selected_character.value.customFields, toCustomFieldObjectField({ name, value }))
    else {
        selected_character.value.customFields = {} //TODO refactor later
        Object.assign(selected_character.value.customFields, toCustomFieldObjectField({ name, value }))
    }
}

async function updateHealthFields(value, title) {
    const item = selected_character.value.health.find(h => h.name === title)
    if (item) {
        item.value += value
    }
    //selected_character.value = await updateCharacter() //TODO refactor update to dto
}

async function addEffect(character_id, effect_id) {
  const effect = state.session.effects.find(e => e.id === effect_id)
  
  state.session.characters.forEach(ch => {
    
    if (ch.id === character_id){
      ch.effects.push({id:effect_id, timeLeft:effect.duration, effect: effect})
      //TODO add dto check and update on api
    }
  })

}
async function removeEffect(character_id, effect_id) {
  state.session.characters.forEach(ch => {
    if (ch.id === character_id){
      removeRow(ch.effects, effect_id)
      //TODO add update on api
    }
  })
}

</script>


<template>

    <MasterPageNavigation />

    <div v-if="!state.isLoading" class="flex items-center justify-center space-x-4 m-2">
        <div class="p-2 border-4 border-darkred-dark_gray  rounded-lg text-3xl font-gothic hover:bg-darkred-gray hover:cursor-pointer transition-colors duration-200"
            :class="selected_character.id === character.id ? 'bg-darkred-gray' : 'bg-darkred-light'"
            v-for="character in state.session.characters" @click="selectCharacter(character)">{{ character.name }}</div>
        <PlusButton @click="selectCharacter({ id: 'empty' })" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg hover:cursor-pointer
           hover:bg-darkred-gray relative overflow-hidden group"
            :class="selected_character.id === 'empty' ? 'bg-darkred-gray text-darkred-light' : 'bg-darkred-light'" />
    </div>



    <section v-if="!state.isLoading" class="m-4 mr-8 grid grid-cols-[25%_75%] gap-2">

        <div class="p-4 w-full flex flex-col justify-start gap-2 font-gothic">
            <button v-for="tab in tabs" :id="tab.id" @click="activeTab = tab.id"
                :class="activeTab === tab.id ? 'bg-darkred-gray' : ''"
                class="p-2 border-4 border-darkred-dark_gray  rounded-lg text-xl font-gothic hover:bg-darkred-gray hover:cursor-pointer transition-colors duration-200">
                {{ tab.label }}
            </button>
        </div>

        <div :id="tabs[0].id" v-if="activeTab === tabs[0].id" class="grid grid-cols-2 auto-rows-min gap-x-4">

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

            <TextAreaEditor fieldName="playerNotes" name="Записки гравця" :value="selected_character.playerNotes"
                :callback="updateCharacter" />
            <TextAreaEditor fieldName="adminNotes" name="Записки майстра" :value="selected_character.adminNotes"
                :callback="updateCharacter" />


        </div>

        <div :id="tabs[1].id" v-if="activeTab === tabs[1].id" class="grid grid-cols-2 auto-rows-min gap-x-4">
            <div class="mt-6 h-min p-2 border-2 rounded-md">
                <h1 class="font-gothic font-medium text-2xl">Список кастомних полей:</h1>
                <CustomFieldsTable v-if="checkObjectFieldExisting(selected_character.customFields)"
                    :fields="selected_character.customFields" :callback="updateCustomFields" :field_removable="true" />
                <h1 class="font-gothic font-medium text-2xl">Додати нове поле:</h1>
                <ObjectFieldsEditor name="CustomFields_" :fields="selected_character.customFields"
                    :callback="addCustomField" />
            </div>

            <div class="mt-6 h-min p-2 border-2 rounded-md">
                <h1 class="font-gothic font-medium text-2xl">Список Характеристик:</h1>
                <CustomFieldsTable v-if="checkObjectFieldExisting(selected_character.characteristics)"
                    :fields="selected_character.characteristics" :callback="updateCharacterCharacteristic"
                    :field_removable="true" />
                <h1 class="font-gothic font-medium text-2xl">Додати нову харакетристику:</h1>
                <ObjectFieldsEditor name="Characteristics_" :fields="selected_character.characteristics"
                    :callback="addCharacterCharacteristic" />
            </div>
        </div>

        <div :id="tabs[2].id" v-if="activeTab === tabs[2].id" class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-2">

            <div v-for="h in selected_character.health">
                <div class="p-1 grow">
                    <ProgressiveBar :value="h.value" :valueMax="h.max" :text="h.name" :colors="h.colors" />
                </div>

                <HorizontalNumberPicker :value="h.value" :min="-h.value" :max="h.max - h.value" :colors="h.colors"
                    :callback="updateHealthFields" :title="h.name" />
            </div>

        </div>

        <div :id="tabs[3].id" v-if="activeTab === tabs[3].id" class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-2">
            
        </div>

        <div :id="tabs[4].id" v-if="activeTab === tabs[4].id" class="">
            <EffectsTableAdmin :characters="state.session.characters" :effects="state.session.effects"
                :callback-add="addEffect" :callback-remove="removeEffect" />
        </div>

        <div :id="tabs[5].id" v-if="activeTab === tabs[5].id" class="flex justify-center items-start">
            <ImageEditor class="w-auto" />
        </div>

    </section>



    <div v-if="state.isLoading" class="text-center py-6">
        <Loader />
    </div>

</template>