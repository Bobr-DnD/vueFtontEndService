<script setup>

</script>

<template>
  <div>
    <div class="bg-darkred-dark/90  border-4 border-darkred-red px-8 py-6 text-center rounded-xl text-darkred-bright animate-pulse-shadow">
      <h1 class="mb-2 text-4xl font-bold drop-shadow-[0_0_8px_#ff4f4f]">
        ⚠ BACKEND OFFLINE ⚠
      </h1>
      <p class="text-lg opacity-85">
        We’re experiencing connection issues. Please try again later.
      </p>
    </div>
  </div>
</template>

<script setup>
const backendOffline = true // example, replace with actual reactive value
</script>

<style scoped>
@keyframes pulse-shadow {
  0% {
    box-shadow: 0 0 5px #ff4f4f;
  }

  50% {
    box-shadow: 0 0 25px #ff4f4f;
  }

  100% {
    box-shadow: 0 0 5px #ff4f4f;
  }
}

.animate-pulse-shadow {
  animation: pulse-shadow 1.5s infinite;
}
</style>
