<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import SessionCard from '@/components/SessionCard.vue'
import Session from '@http/sessionRepository'
import backendOffline from '@/components/backendOffline.vue'

const sessions = ref([])
let backendStatus = true

onMounted(async () => {
  try {
    const res = await Session.get()
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
  <SessionCard :v-if="backendStatus" v-for="session in sessions" :id="session.id" :session="session" />

  <backendOffline :v-if="!backendStatus"/>
</template>

<style scoped></style>