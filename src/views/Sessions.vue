<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
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
  <h1>Sessions</h1>

  <ul>
    <li v-for="session in sessions" :key="session.id" class="test">
      {{ session.name }}
    </li>
  </ul>
</template>

<style scoped></style>