<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory'
import MasterPageNavigation from '@/components/MasterPageNavigation.vue';

const id = useRoute().params.id
const state = reactive({
  session: {},
  players: [],
  effects: []
})
onMounted(async () => {
  try {
    const res = await RepositoryFactory.getById('session', id)
    state.session = res.data
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <MasterPageNavigation />
  <h1>admin view</h1>
  <h2>{{ id }}</h2>

  <h3>{{ state.session.name }}</h3>
</template>

<style scoped></style>