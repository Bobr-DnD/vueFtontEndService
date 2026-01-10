<script setup>
import { reactive, onMounted } from 'vue'
import { asyncHandler } from '/utils/asyncHandler'

import Loader from 'vue-spinner/src/SyncLoader.vue'
import Navigation from '@/components/navigations/Navigation.vue'
import SessionCard from '@/components/reusable/SessionCard.vue'
import RepositoryFactory from '@http/RepositoryFactory'

const state = reactive({
  sessions: [],
  isLoading: true
})

onMounted(async () => {

  const [res, err] = await asyncHandler(
    RepositoryFactory.get('session')
  )
  if (err) return

  state.sessions = res.data
  state.isLoading = false
})
</script>

<template>
  <Navigation />
  <SessionCard v-if="!state.isLoading" v-for="session in state.sessions" :key="session.id" :id="session.id"
    :session="session" />

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>
</template>

<style scoped></style>