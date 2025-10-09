<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import SessionViewNavigtaion from '@/components/SessionViewNavigtaion.vue';
import characterCard from '@/components/character-page components/characterCard.vue';

const sessionId = useRoute().params.sessionId
const state = reactive({
  session: {},
  isLoading: true
})

onMounted(async () => {
  try {
    const res = await RepositoryFactory.getById('session', sessionId)
    state.session = res.data

  } catch (err) {
    console.error(err)
  }
  finally {
    state.isLoading = false
  }
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