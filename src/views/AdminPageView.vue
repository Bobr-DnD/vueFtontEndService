<script setup>
import { onMounted, reactive, ref, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { asyncHandler } from '/utils/asyncHandler';
import { removeRow } from '/utils/entityHelper'
import { checkObjectFieldExisting } from '/utils/entityHelper'
import { toEffectObjectField, toEmptyCharacterObject } from '/utils/objects.dto.js';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import RepositoryFactory from '@http/RepositoryFactory'

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import ButtonGrayAnimated from '@/components/reusable/Buttons/ButtonGrayAnimated.vue';
import EffectsTableAdmin from '@/components/admin-page components/EffectsTableAdmin.vue';
import CustomFieldsTable from '@/components/reusable/CustomFieldsTable.vue';
import PerkRow from '@/components/character-page components/PerkTable.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true
})

const characterShowed = ref(false)
const moveShowed = ref(true)
const effectsShowed = ref(false)
const selected_character = ref({})

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
  selected_character.value = toEmptyCharacterObject(state.session.characters[0])
})

function getEffects(characters) {
  characters.forEach(character => {
    character.effects.forEach(effect => {
      state.session.effects.forEach(ses_effect => {
        if (ses_effect.id === effect.id) effect.effect = ses_effect
      })
    })
  })
}

async function updateSession() {
  const [res, err] = await asyncHandler(
    RepositoryFactory.update('session', sessionId, state.session)
  )
  if (err) {
    notify({ message: err.message, type: 'error' })
    return
  }
  return res.data
}

async function updateCharacter(character) {
  const [res, err] = await asyncHandler(
    RepositoryFactory.update('character', character.id, character)
  )
  if (err) {
    notify({ message: err.message, type: 'error' })
    return
  }
  return toEmptyCharacterObject(res.data)
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

    if (ch.id === character_id) {
      ch.effects.push({ id: effect_id, timeLeft: effect.duration, effect: effect })
      //TODO add dto check and update on api
    }
  })

}
async function removeEffect(character_id, effect_id) {
  state.session.characters.forEach(ch => {
    if (ch.id === character_id) {
      removeRow(ch.effects, effect_id)
      //TODO add update on api
    }
  })
}

async function addPerk() {
  const characterNew = await updateCharacter(selected_character.value)
  selected_character.value = characterNew
}

</script>

<template>

  <MasterPageNavigation />

  <div class="w-full my-6 flex flex-wrap justify-center items-center">

    <ButtonGrayAnimated v-if="state.session.customFields" @click="fieldsShowed = !fieldsShowed" title="Гроші\Кастомні
      поля" />
    <ButtonGrayAnimated @click="moveShowed = !moveShowed" title="Хід" />
    <ButtonGrayAnimated @click="effectsShowed = !effectsShowed" title="Еффекти персонажів" />
    <ButtonGrayAnimated @click="characterShowed = !characterShowed" title="Перки персонажів" />

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

  <div v-if="!state.isLoading && characterShowed"
    class="flex flex-col items-center gap-2 justify-center flex-wrap mt-5">

    <div class="flex justify-center items-center gap-2">
      <GraySelectorButton v-for="character in state.session.characters" @click="selected_character = character"
        :id="character.id" :label="character.name" :active="selected_character.id === character.id ? true : false" />
    </div>

    <div class="w-96 mx-auto" :class="'shrink-' + state.session.characters.count">
      <PerkRow :perks_all="state.session.perks" :perks="selected_character.perks" :perkPoints="1" :callback="addPerk"
        :removable="true" />
    </div>

  </div>

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>

</template>

<style scoped></style>