<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';

import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/navigations/SessionViewNavigtaion.vue';
import characterCard from '@/components/reusable/CharacterCard.vue';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true
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
</script>

<template>
  <SessionViewNavigtaion />
  <div v-if="!state.isLoading" class="flex items-start justify-center flex-wrap mt-5">
    <characterCard v-for="character in state.session.characters" :character="character" :routing="true" />
  </div>

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>
</template>

<style scoped></style>