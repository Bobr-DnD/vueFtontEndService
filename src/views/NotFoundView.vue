<script setup>
import Navigation from '@/components/Navigation.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <Navigation />
  <div
    class="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-darkred-red to-gray-900 px-4">
    <h1 class="text-9xl font-extrabold text-yellow-400 drop-shadow-lg animate-bounce">
      404
    </h1>
    <p class="mt-4 text-2xl md:text-3xl text-gray-200 font-bold">
      You’ve wandered into the Wasteland...
    </p>
    <p class="mt-2 text-lg text-gray-400">
      The page you’re looking for has been lost to radiation storms.
    </p>

    <RouterLink to="/"
      class="mt-8 px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold shadow-lg shadow-yellow-900/50 transition-all duration-200 hover:scale-105">
      Back to Safety
    </RouterLink>
  </div>
</template>

<style scoped>
@keyframes flicker {

  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    text-shadow:
      0 0 4px #fff,
      0 0 11px #fffa,
      0 0 19px #fffa,
      0 0 40px #ff0,
      0 0 80px #ff0;
  }

  20%,
  24%,
  55% {
    text-shadow: none;
  }
}

.animate-flicker {
  animation: flicker 1.5s infinite alternate;
}
</style>
