<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { asyncHandler } from '/utils/asyncHandler';
import { removeRow, addRow } from '/utils/entityHelper'
import Loader from 'vue-spinner/src/SyncLoader.vue'
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import RepositoryFactory from '@http/RepositoryFactory'
import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import characterCard from '@/components/reusable/CharacterCard.vue';
import ButtonGrayAnimated from '@/components/reusable/ButtonGrayAnimated.vue';
import EffectsTableAdmin from '@/components/admin-page components/EffectsTableAdmin.vue';
import CustomFieldsTable from '@/components/reusable/CustomFieldsTable.vue';
import { toEffectObjectField } from '/utils/objects.dto.js';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true
})

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
  getEffects(state.session.characters);
})

let characterShowed = ref(false)
let fieldsShowed = ref(true)
let moveShowed = ref(true)
let effectsShowed = ref(true)

function getEffects(characters) {
  characters.forEach(character => {
    character.effects.forEach(effect => {
      state.session.effects.forEach(ses_effect => {
        if (ses_effect.id === effect.id) effect.effect = ses_effect
      })
    })
  })
}

function checkObjectFieldExisting(field) {
  return (field !== undefined && field !== null)
}

function checkArrayFieldExisting(field) {
  return field.length
}

async function updateSession() {
  const [res, err] = await asyncHandler(
    RepositoryFactory.update('session', sessionId, state.session)
  )
  if (err) {
    console.warn(err.message)
    return
  }
  return res.data
}

async function updateMove(name, value) {
  state.session.move += value
  state.session = await updateSession()
}

async function updateCustomFields(fields) {
  state.session.customFields = fields
  state.session = await updateCharacter()
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

  <div class="w-full my-6 flex flex-wrap justify-center items-center">

    <ButtonGrayAnimated @click="characterShowed = !characterShowed" title="Персонажі" />
    <ButtonGrayAnimated v-if="state.session.customFields" @click="fieldsShowed = !fieldsShowed" title="Гроші\Кастомні
      поля" />
    <ButtonGrayAnimated @click="moveShowed = !moveShowed" title="Хід" />
    <ButtonGrayAnimated @click="effectsShowed = !effectsShowed" title="Еффекти" />
  </div>

  <div v-if="!state.isLoading && characterShowed" class="flex items-start justify-center flex-wrap mt-5">
    <characterCard v-for="character in state.session.characters" :character="character" />
  </div>

  <CustomFieldsTable v-if="checkObjectFieldExisting(state.session.customFields)" :fields="state.character.customFields"
    :callback="updateCustomFields" />

  <div v-if="!state.isLoading && moveShowed" class="flex items-center justify-center">
    <FormAddSubtract label="Move" entity_name="Хід" :value="state.session.move" :callback="updateMove" />
  </div>

  <div v-if="!state.isLoading && effectsShowed" class="flex flex-col flex-wrap items-center justify-center my-6">

    <EffectsTableAdmin :characters="state.session.characters" :effects="state.session.effects" :callback-add="addEffect"
      :callback-remove="removeEffect" />

  </div>

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>

</template>

<style scoped></style>