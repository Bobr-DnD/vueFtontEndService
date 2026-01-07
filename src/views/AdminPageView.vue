<script setup>
import { onMounted, reactive, ref, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { asyncHandler } from '/utils/asyncHandler';
import { checkObjectFieldExisting, addRow, removeRow, groupById, filterDuplicates } from '/utils/entityHelper'
import { toNewCharacterObject } from '/utils/objects.dto.js';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import RepositoryFactory from '@http/RepositoryFactory'

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import EffectTile from '@/components/reusable/EntityTiles/EffectTile.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';
import PerkTile from '@/components/reusable/EntityTiles/PerkTile.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true,
  selectedChatacter: {}
})

const effectsModalShowed = ref(false)
const perksModalShowed = ref(false)
const sessionPerksSearchQuery = ref('')
const sessionEffectsSearchQuery = ref('')

const filteredCharacterPerks = computed(() => {
  const grouped = groupById(state.selectedChatacter.perks)

  return grouped
})

const filteredSessionPerks = computed(() => {
  const filtered = filterDuplicates(state.session.perks, state.selectedChatacter.perks)

  if (!sessionPerksSearchQuery.value.trim()) return filtered

  const query = sessionPerksSearchQuery.value.toLowerCase()
  return filtered.filter(el =>
    el.name.toLowerCase().includes(query)
  )

})

const filteredSessionEffects = computed(() => {

  const filtered = filterDuplicates(state.session.effects, state.selectedChatacter.effects)

  if (!sessionEffectsSearchQuery.value.trim()) return filtered

  const query = sessionEffectsSearchQuery.value.toLowerCase()
  return filtered.filter(el =>
    el.name.toLowerCase().includes(query)
  )
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
  state.selectedChatacter = state.session.characters[0]
})

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
  return toNewCharacterObject(res.data)
}


async function updateCustomFields(fields) {
  state.session.customFields = fields
  state.session = await updateCharacter()
}

</script>

<template>

  <MasterPageNavigation />

  <div v-if="!state.isLoading" class="w-full gap-4 my-6 flex flex-wrap justify-center items-center">

    <GraySelectorButton v-for="character in state.session.characters" :id="character.id" :label="character.name"
      :active="state.selectedChatacter.id === character.id" @click="state.selectedChatacter = character" />

  </div>

  <section v-if="!state.isLoading" class="m-4 p-2 flex flex-col gap-4 justify-center items-center">

    <div class="w-full grid grid-cols-4 gap-4">
      <Header1 class="col-span-full" label="Ефекти:" />

      <div v-if="checkObjectFieldExisting(state.selectedChatacter.effects)"
        v-for="effect in state.selectedChatacter.effects"
        class="grid grid-cols-[1fr_56px] px-2 gap-4 bg-darkred-dark rounded-2xl">

        <EffectTile :effect="effect" />
        <DeleteButton class="w-14 h-14 bg-darkred-red text-darkred-light text-2xl self-center justify-self-end"
          @click="removeRow(state.selectedChatacter.effects, effect.id)" />

      </div>

      <Header2 v-else class="col-span-full" label="Пусто" />
      <PlusButton class="col-span-full justify-self-center w-24 border-8 border-darkred-dark rounded-lg"
        @click="effectsModalShowed = !effectsModalShowed" />

    </div>

    <div class="w-full grid grid-cols-1 gap-4">
      <Header1 class="col-span-full" label="Перки:" />

      <div v-if="checkObjectFieldExisting(state.selectedChatacter.perks)" class="grid grid-cols-4 gap-4">

        <div v-for="perk in filteredCharacterPerks"
          class="px-4 py-3 text-lg bg-darkred-dark rounded-2xl text-darkred-light">
          <div class="flex flex-col gap-1 h-full">

            <div class="text-xl font-medium">
              {{ perk.name }}
            </div>

            <div class="">
              Рівень: {{ perk.count }}
            </div>

            <div class="flex flex-col gap-2 ">

              <div class="rounded-lg">Опис:</div>

              <div v-for="desc, index in perk.descriptions" class="p-2 bg-darkred-dark_gray rounded-lg"
                :class="index === perk.count - 1 && 'bg-darkred-gray'">
                • {{ desc }}
              </div>

            </div>

            <div class="flex flex-col justify-end items-center gap-2 h-full">
              <ApproveButton v-if="perk.count < perk.ranks"
                class="h-10 w-full text-2xl flex items-center justify-center"
                @click="addRow(state.session.perks, state.selectedChatacter.perks, perk.id)" />

              <DeleteButton
                class="h-10 w-full bg-darkred-red text-darkred-light text-2xl flex items-center justify-center"
                @click="removeRow(state.selectedChatacter.perks, perk.id)" />

            </div>

          </div>

        </div>

      </div>

      <Header2 v-else class="col-span-full" label="Пусто" />
      <PlusButton class="col-span-full justify-self-center w-24 border-8 border-darkred-dark rounded-lg"
        @click="perksModalShowed = !perksModalShowed" />

    </div>

  </section>

  <section v-if="!state.isLoading" class="m-4 p-2">

    <div v-if="effectsModalShowed" class="modal-overlay flex justify-center items-center"
      @click="effectsModalShowed = false">

      <div @click.stop
        class="w-full mx-2 p-2 flex flex-col gap-2 rounded-xl bg-darkred-dark text-darkred-light shadow-xl space-y-2 relative font-gothic text-lg md:hover:cursor-default">

        <div>
          <SearchInputBlack class="w-[95%]" v-model:searchQuery="sessionEffectsSearchQuery" />
          <CloseButtonRedBG @click="effectsModalShowed = false" />
        </div>

        <div class="max-h-[650px] w-full grid grid-cols-4 gap-4 overflow-y-scroll no-scrollbar">
          <EffectTile class="border-4 border-darkred-gray rounded-lg md:hover:cursor-pointer" v-for="effect in filteredSessionEffects"
            :effect=effect @click="addRow(state.session.effects, state.selectedChatacter.effects, effect.id); effectsModalShowed = false"/>
        </div>

      </div>

    </div>

    <div v-if="perksModalShowed" class="modal-overlay flex justify-center items-center"
      @click="perksModalShowed = false">

      <div @click.stop
        class="w-full mx-2 p-2 flex flex-col gap-2 rounded-xl bg-darkred-dark text-darkred-light shadow-xl space-y-2 relative font-gothic text-lg md:hover:cursor-default">

        <div class="col-span-full">
          <SearchInputBlack class="w-[95%]" v-model:searchQuery="sessionPerksSearchQuery" />
          <CloseButtonRedBG @click="perksModalShowed = false" />
        </div>

        <div class="max-h-[650px] w-full grid grid-cols-4 gap-2 overflow-y-scroll no-scrollbar">
          <PerkTile class="border-4 border-darkred-gray rounded-lg"
            @click="addRow(state.session.perks, state.selectedChatacter.perks, perk.id); perksModalShowed = false"
            v-for="perk in filteredSessionPerks" :perk="perk" />
        </div>


      </div>

    </div>

  </section>

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>

</template>

<style scoped></style>