<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, computed, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { checkObjectFieldExisting, addRow, removeRow, groupById, filterDuplicates } from '/utils/entityHelper'
import { socket, connected } from '@ws/webSocket';
import { notify } from '@utils/notification';

import Loader from 'vue-spinner/src/SyncLoader.vue'

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
import ObjectFieldsTable from '@/components/reusable/ObjectFieldsTable.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import BackendOffline from '@/components/reusable/BackendOffline.vue';
import { toNewSession } from '/utils/objects.dto';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  selectedChatacter: {},
  isLoading: true
})

const effectsModalShowed = ref(false)
const perksModalShowed = ref(false)
const sessionPerksSearchQuery = ref('')
const sessionEffectsSearchQuery = ref('')
const isBackendOffline = ref(false)
const offlineTimeOut = ref(null)

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

onMounted(() => {
  socket.emit('session:get', sessionId)
})

onBeforeUnmount(() => {
  const events = ['character:update', 'session:updateSession', 'session:get', 'session:updateEverywhere', 'session:updateAdmin', 'character:get']
  events.forEach(e => socket.off(e))
})

socket.on('character:update', (character) => {
  if (character.id === state.selectedChatacter.id) state.selectedChatacter = character
  else {
    state.session.characters = state.session.characters.map(ch =>
      ch.id === character.id ? character : ch
    )
  }

  notify({ message: `Персонаж ${character.name} був оновлений`, type: 'warning' })

})

socket.on('session:updateSession', (session) => {
  state.session = toNewSession(session)
})

socket.on('session:updateEverywhere', (session) => {
  state.session = toNewSession(session)
  socket.emit('character:get', state.selectedChatacter.id)
  notify({ message: `Сесія була оновлена глобально`, type: 'warning' })
})

socket.on('session:updateAdmin', (session) => {
  state.session = toNewSession(session)
  socket.emit('character:get', state.selectedChatacter.id)
  notify({ message: `Сесія була оновлена лише для майстра`, type: 'warning' })
})

socket.on('session:get', (session) => {
  state.session = toNewSession(session)
  state.selectedChatacter = state.session.characters[0]
  state.isLoading = false
})

socket.on('character:get', (character) => {
  if (character.id === state.selectedChatacter.id) state.selectedChatacter = character
  else {
    state.session.characters = state.session.characters.map(ch =>
      ch.id === character.id ? character : ch
    )
  }
})

watch(connected, (isConnected) => {
  if (isConnected) {
    if (offlineTimeOut.value) {

      clearTimeout(offlineTimeOut.value)
      offlineTimeOut.value = null
    }

    socket.emit('session:get', sessionId)

    isBackendOffline.value = false
    state.isLoading = false
  }
  else {
    state.isLoading = true
    if (!isBackendOffline.value) {
      offlineTimeOut.value = setTimeout(() => {

        isBackendOffline.value = true
      }, 30 * 1000)
    }
  }

})

function updateSession() {
  socket.emit('session:updateSession', toRaw(state.session))
}

function updateCharacter() {
  socket.emit('character:update', toRaw(state.selectedChatacter))
}

function updateCharacterCharacteristic(fields) {
  state.selectedChatacter.characteristics = fields
  updateCharacter()
}

function updateSessionField(fieldName, field) {
  state.session[fieldName] = field
  updateSession()
}

</script>

<template>

  <MasterPageNavigation />

  <section v-if="!state.isLoading" class="m-4 pr-6 pl-2 py-2">
    <TextAreaEditor fieldName="notes" name="Записки майстра" :value="state.session.notes"
      :callback="updateSessionField" />
  </section>

  <div v-if="!state.isLoading" class="w-full gap-4 my-6 flex flex-wrap justify-center items-center">

    <GraySelectorButton v-for="character in state.session.characters" :id="character.id" :label="character.name"
      :active="state.selectedChatacter.id === character.id" @click="state.selectedChatacter = toRaw(character)" />

  </div>

  <section v-if="!state.isLoading" class="m-4 p-2 flex flex-col gap-4">
    <Header1 label="Характеристики:" />

    <div class="flex flex-wrap gap-4">
      <ObjectFieldsTable v-if="checkObjectFieldExisting(state.selectedChatacter.characteristics)"
        :fields="state.selectedChatacter.characteristics" :callback="updateCharacterCharacteristic" />
    </div>
  </section>

  <section v-if="!state.isLoading" class="m-4 p-2 flex flex-col gap-4 justify-center items-center">

    <div class="w-full grid grid-cols-4 gap-4">
      <Header1 class="col-span-full" label="Ефекти:" />

      <div v-if="checkObjectFieldExisting(state.selectedChatacter.effects)"
        v-for="effect in state.selectedChatacter.effects"
        class="grid grid-cols-[1fr_56px] px-2 gap-4 bg-darkred-dark rounded-2xl">

        <EffectTile :effect="effect" />
        <DeleteButton class="w-14 h-14 bg-darkred-red text-darkred-light text-2xl self-center justify-self-end"
          @click="removeRow(state.selectedChatacter.effects, effect.id); updateCharacter()" />

      </div>

      <Header2 v-else class="col-span-full" label="Пусто" />

      <div @click="effectsModalShowed = !effectsModalShowed"
        class="w-64 col-span-full justify-self-center border-8 border-darkred-dark rounded-lg bg-darkred-dark_gray text-darkred-light flex justify-center items-center hover:cursor-pointer">
        <PlusButton class="w-20" />
      </div>

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
                @click="addRow(state.session.perks, state.selectedChatacter.perks, perk.id); updateCharacter()" />

              <DeleteButton
                class="h-10 w-full bg-darkred-red text-darkred-light text-2xl flex items-center justify-center"
                @click="removeRow(state.selectedChatacter.perks, perk.id); updateCharacter()" />

            </div>

          </div>

        </div>

      </div>

      <Header2 v-else class="col-span-full" label="Пусто" />

      <div @click="perksModalShowed = !perksModalShowed"
        class="w-64 col-span-full justify-self-center border-8 border-darkred-dark rounded-lg bg-darkred-dark_gray text-darkred-light flex justify-center items-center hover:cursor-pointer">
        <PlusButton class="w-20" />
      </div>

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

          <EffectTile class="border-4 border-darkred-gray rounded-lg md:hover:cursor-pointer"
            v-for="effect in filteredSessionEffects" :effect=effect
            @click="addRow(state.session.effects, state.selectedChatacter.effects, effect.id); effectsModalShowed = false; updateCharacter()" />

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
            @click="addRow(state.session.perks, state.selectedChatacter.perks, perk.id); perksModalShowed = false; updateCharacter()"
            v-for="perk in filteredSessionPerks" :perk="perk" />
        </div>


      </div>

    </div>

  </section>

  <div v-if="state.isLoading" class="w-full text-center py-6 flex flex-col gap-10 justify-center items-center">
    <BackendOffline v-if="isBackendOffline" class="w-[650px]" />
    <Loader class="[&>*]:bg-darkred-red" />
  </div>

</template>

<style scoped></style>