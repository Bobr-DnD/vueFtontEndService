<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { socket } from '@ws/webSocket';

import CardsLoader from '@/components/reusable/Loaders/CardsLoader.vue';
import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import characterCard from '@/components/reusable/CharacterCard.vue';

const sessionId = useRoute().params.sessionId

const session = ref({})
const isLoading = ref(true)
const charactersOnlineIds = ref([])

onMounted(async () => {
  const [res, err] = await asyncHandler(
    RepositoryFactory.getById('session/plainWithPlainCharacters', sessionId)
  )
  if (err) {
    console.warn(err.message)
    return
  }
  else isLoading.value = false

  session.value = res.data
})

function onSessionUpdate(update) {
  charactersOnlineIds.value = [];
  const room = update.room;

  if (room) {
    // "online" means a character is actively connected - the viewer's own
    // role doesn't matter, since an admin can open a character page too (the
    // router lets an admin token satisfy a /session/ route).
    charactersOnlineIds.value = room.members.filter(el => el[1].userId).map(el => el[1].userId)
  }
}

socket.on('session:update', onSessionUpdate)

onBeforeUnmount(() => {
  socket.off('session:update', onSessionUpdate)
})
</script>

<template>
  <SessionViewNavigtaion />
  <div v-if="!isLoading" class="flex gap-8 items-start justify-center flex-wrap mt-5">
    <characterCard v-for="character in session.characters" :key="character.id" :character="character"
      :routing="true" :online="charactersOnlineIds.includes(character.id)" />
  </div>

  <div v-if="isLoading" class="h-full flex justify-center items-center">
    <CardsLoader />
  </div>

</template>

<style scoped></style>