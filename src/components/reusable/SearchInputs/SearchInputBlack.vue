<script setup>
import RejectButtonWithText from '../Buttons/RejectButtonWithText.vue';

const searchQuery = defineModel('searchQuery', { type: String, required: true, default: '' })

</script>

<template>
    <div class="flex gap-2">

        <input v-model="searchQuery" placeholder="Пошук ..."
            class="h-12 w-full p-2 col-span-3 rounded-lg bg-darkred-dark_gray text-darkred-light" />

        <RejectButtonWithText v-if="searchQuery" @click="searchQuery = ''" text="Очистити" />
    </div>
</template>