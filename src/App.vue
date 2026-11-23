<script setup>
import {RouterView} from 'vue-router'
import NotificationSystem from './components/reusable/NotificationSystem.vue';
import { useThemeStore } from '@/stores/themeStore';

// Instantiates the store so its session -> CSS vars watcher runs for the app's lifetime.
useThemeStore()
</script>

<template>
  <RouterView />
  <NotificationSystem />
</template>

<style scoped></style>
