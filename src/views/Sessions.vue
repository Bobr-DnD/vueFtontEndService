<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import SessionCard from '@/components/SessionCard.vue'
import Session from '@http/sessionRepository'

const sessions = ref([])

onMounted(async () => {
  try {
    const res = await Session.get()
    sessions.value = res.data

  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <Navigation />
  <SessionCard v-for="session in sessions" :id="session.id" :session="session" />
</template>

<style scoped></style>