<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import FormNumber from '@/components/FormNumber.vue';
import FormButtonPlusOne from '@/components/FormButtonPlusOne.vue';
import RepositoryFactory from '@http/RepositoryFactory'
import MasterPageNavigation from '@/components/MasterPageNavigation.vue';
import characterCard from '@/components/characterCard.vue';
import FormString from '@/components/FormString.vue';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true
})

onMounted(async () => {
  try {
    const res = await RepositoryFactory.getById('session', sessionId)
    state.session = res.data

  } catch (err) {
    console.error(err)
  }
  finally {
    state.isLoading = false
    getEffects(state.session.characters)

    effect_id.value = state.session.effects[0].id
    character_id.value = state.session.characters[0].id
    character.value = state.session.characters[0]
  }
})

let characterShowed = ref(false)
let fieldsShowed = ref(true)
let moveShowed = ref(true)
let effectsShowed = ref(true)
let effect_id = ref('0')
let character_id = ref('0')
let character = ref({})


function getEffects(characters) {
  characters.forEach(character => {
    character.effects.forEach(effect => {
      state.session.effects.forEach(ses_effect => {
        if (ses_effect.id === effect.effect) effect.effect = ses_effect
      })
    })
  })
}

function changeCharacter(event) {
  character_id.value = event.target.value
  state.session.characters.forEach(ch => {
    if (ch.id === character_id.value) character.value = ch
  })
}
async function addEffect() {

}
async function deleteEffect(id) {

}

</script>

<template>

  <MasterPageNavigation />

  <div class="w-full my-6 flex flex-wrap justify-center items-center">

    <button @click="characterShowed = !characterShowed" class="p-6 m-2 bg-darkred-gray text-darkred-dark font-medium text-lg rounded-2xl transition-all duration-300 ease-in-outhover:bg-darkred-red 
      hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(216,64,64,0.6)] active:scale-95">Персонажі</button>
    <button @click="fieldsShowed = !fieldsShowed" class="p-6 m-2 bg-darkred-gray text-darkred-dark font-medium text-lg rounded-2xl transition-all duration-300 ease-in-outhover:bg-darkred-red 
      hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(216,64,64,0.6)] active:scale-95">Гроші\Кастомні
      поля</button>
    <button @click="moveShowed = !moveShowed" class="p-6 m-2 bg-darkred-gray text-darkred-dark font-medium text-lg rounded-2xl transition-all duration-300 ease-in-outhover:bg-darkred-red 
      hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(216,64,64,0.6)] active:scale-95">Хід</button>
    <button @click="effectsShowed = !effectsShowed" class="p-6 m-2 bg-darkred-gray text-darkred-dark font-medium text-lg rounded-2xl transition-all duration-300 ease-in-outhover:bg-darkred-red 
      hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(216,64,64,0.6)] active:scale-95">Еффекти</button>

  </div>

  <div v-if="!state.isLoading && characterShowed" class="flex items-start justify-center flex-wrap mt-5">
    <characterCard v-for="character in state.session.characters" :character="character" />
  </div>

  <div v-if="!state.isLoading && fieldsShowed" class="flex flex-wrap items-center justify-center mt-4">
    <div class="mx-4">
      <FormNumber v-for="value, name in state.session.currency" :label="'Currency_' + name" :entity_name="name"
        v-model:value="state.session.currency[name]" />
    </div>

    <div class="mx-4 grid md:grid-flow-col md:grid-rows-2 md:auto-cols-auto auto-grid-rows grid-flow-row grid-cols-1  gap-2">
      <div v-for="value, name in state.session.customFields">
        <FormNumber v-if="typeof (value) === 'number'" :label="'CustomFields_' + name" :entity_name="name"
          v-model:value="state.session.customFields[name]" />
        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + name" :entity_name="name"
          v-model:value="state.session.customFields[name]" />
      </div>
    </div>

  </div>

  <div v-if="!state.isLoading && moveShowed" class="flex items-center justify-center">
    <FormButtonPlusOne label="Move" entity_name="Хід" v-model:value="state.session.move" />
  </div>

  <div v-if="!state.isLoading && effectsShowed" class="flex flex-col flex-wrap items-center justify-center my-6">

    <select @change="changeCharacter" name="Effect_Characters" class="block w-64 px-4 py-2 my-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xl font-gothic font-medium shadow-sm
         focus:outline-none focus:ring-2 focus:ring-darkred-bright focus:border-darkred-bright">
      <option v-for="character in state.session.characters" :key="character.id" :value="character.id"
        class="bg-darkred-light text-darkred-dark font-gothic font-medium">
        {{ character.name }}
      </option>
    </select>

    <select @change="event => effect_id = event.target.value" name="Effects" class="block w-64 px-4 py-2 my-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xl font-gothic font-medium shadow-sm
         focus:outline-none focus:ring-2 focus:ring-darkred-bright focus:border-darkred-bright">
      <option v-for="effect in state.session.effects" :key="effect.id" :value="effect.id"
        class="bg-darkred-light text-darkred-dark font-gothic font-medium">
        {{ effect.name }}
      </option>
    </select>

    <button @click="addEffect" class="px-6 py-3 my-2 rounded-xl border-4 border-darkred-red text-darkred-dark font-univers font-semibold text-lg
         hover:bg-darkred-red hover:text-darkred-light transition-colors duration-300">Додати еффект</button>
  <!--Make component later-->
    <div class="bg-darkred-gray rounded-lg shadow-[rgba(0,0,0,0.5)_0px_8px_20px_4px] p-4 my-4 text-darkred-light">

      <div
        class="grid grid-cols-4 gap-2 justify-items-center items-center  rounded-lg font-medium text-lg bg-darkred-dark_gray">
        <div class="rounded-md p-2 w-full text-center">Назва</div>
        <div class="rounded-md p-2 w-full text-center">Інформація</div>
        <div class="rounded-md p-2 w-full text-center">Тривалість</div>
        <div class="rounded-md p-2 w-full text-center">Видалити</div>
      </div>

      <div
        class="grid grid-cols-4 gap-2 justify-items-center items-center font-medium text-md rounded-lg bg-darkred-dark_gray p-2 mt-2"
        v-for="effect in character.effects">
        <div class="p-2 rounded-md  w-full text-center">{{ effect.effect.description }}</div>
        <div class="p-2 rounded-md w-full text-center">{{ effect.effect.name }}</div>
        <div class="p-2 rounded-md w-full text-center">{{ effect.deathTime }}</div>
        <button @click="deleteEffect(effect.effect.id)" class="p-2 bg-darkred-red rounded-xl w-3/5 text-2xl
         hover:bg-darkred-bright transition-all duration-300 shadow-md hover:shadow-lg">X</button>
      </div>
    </div>

  </div>


  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>
</template>

<style scoped></style>