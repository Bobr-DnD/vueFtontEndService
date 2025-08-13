<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import RepositoryFactory from '@http/RepositoryFactory'
import MasterPageNavigation from '@/components/MasterPageNavigation.vue';
import characterCard from '@/components/characterCard.vue';

const id = useRoute().params.id
const state = reactive({
  session: {},
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
  <div  class="flex items-center justify-center flex-nowrap mt-5">
    <characterCard v-for="character in state.session.characters" :character="character"/>
  </div>
</template>

<style scoped></style>