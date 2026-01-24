<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { socket } from '@ws/webSocket';

import CardsLoader from '@/components/reusable/Loaders/CardsLoader.vue';
import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import characterCard from '@/components/reusable/CharacterCard.vue';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true,
  charactersOnlineIds: []
})

onMounted(async () => {
  const [res, err] = await asyncHandler(
    RepositoryFactory.getById('session', sessionId)
  )
  if (err) {
    console.warn(err.message)
    return
  }
  else state.isLoading = false

  state.session = res.data
})

socket.on('session:update', (session) => {
  state.charactersOnlineIds = [];
  const room = session.room;

  if (room) {
    state.charactersOnlineIds = room.members.filter(el => el[1].role === 'user' && el[1].userId).map(el => el[1].userId)
  }
})
</script>

<template>
  <SessionViewNavigtaion />
  <div v-if="!state.isLoading" class="flex items-start justify-center flex-wrap mt-5">
    <characterCard v-for="character in state.session.characters" :key="character.id" :character="character"
      :routing="true" :online="state.charactersOnlineIds.includes(character.id)" />
  </div>

  <div v-if="state.isLoading" class="h-full flex justify-center items-center">
    <CardsLoader />
  </div>

</template>

<style scoped></style>