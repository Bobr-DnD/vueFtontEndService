<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import SessionCard from '@/components/SessionCard.vue'
import RepositoryFactory from '@http/RepositoryFactory'

const sessions = ref([])
let backendStatus = true

onMounted(async () => {
  try {
    const res = await RepositoryFactory.get('session')
    sessions.value = res.data

  } catch (err) {
    console.error(err)
    backendStatus = false
  }
  finally{
    backendStatus = true
  }
})
</script>

<template>
  <Navigation />
  <SessionCard v-for="session in sessions" :id="session.id" :session="session" />
</template>

<style scoped></style>