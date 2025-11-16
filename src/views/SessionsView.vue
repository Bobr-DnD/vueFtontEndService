<script setup>
import { reactive, onMounted } from 'vue'
import Loader from 'vue-spinner/src/SyncLoader.vue'
import Navigation from '@/components/navigations/Navigation.vue'
import SessionCard from '@/components/reusable/SessionCard.vue'
import RepositoryFactory from '@http/RepositoryFactory'

const state = reactive({
  sessions: [],
  isLoading: true
})

onMounted(async () => {
  try {
    const res = await RepositoryFactory.get('session')
    state.sessions = res.data
  } catch (err) {
    notify({ message: err.message, type: 'error' })
  }
  finally {
    state.isLoading = false
  }
})
</script>

<template>
  <Navigation />
  <SessionCard v-if="!state.isLoading" v-for="session in state.sessions" :id="session.id" :session="session" />

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>
</template>

<style scoped></style>