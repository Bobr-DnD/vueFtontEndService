<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import Loader from 'vue-spinner/src/SyncLoader.vue'
import RepositoryFactory from '@http/RepositoryFactory'
import MasterPageNavigation from '@/components/MasterPageNavigation.vue';
import characterCard from '@/components/characterCard.vue';

const id = useRoute().params.id
const state = reactive({
  session: {},
  isLoading: true
})
onMounted(async () => {
  try {
    const res = await RepositoryFactory.getById('session', id)
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
  <MasterPageNavigation />
  <div v-if="!state.isLoading" class="flex items-center justify-center flex-wrap mt-5">
    <characterCard v-for="character in state.session.characters" :character="character" />
  </div>

  <div v-if="state.isLoading" class="text-center py-6">
    <Loader />
  </div>
</template>

<style scoped></style>