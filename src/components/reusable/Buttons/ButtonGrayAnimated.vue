<script setup>
    const props = defineProps({
        title: {type: String, required: true}
    })
</script>

<template>
    <button class="p-6 m-2 bg-darkred-gray text-darkred-dark font-medium text-lg rounded-2xl transition-all duration-300 ease-in-outhover:bg-darkred-red 
      hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(216,64,64,0.6)] active:scale-95">{{ title }}</button>
</template>