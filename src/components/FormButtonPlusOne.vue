<script setup>
import { PlusIcon } from '@heroicons/vue/24/solid'
const value = defineModel('value', { type: Number, required: true })
const props = defineProps({
    entity_name: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="flex flex-wrap items-center justify-between p-6  rounded-xl w-64 shadow-[rgba(0,0,0,0.5)_0px_8px_24px]">
        <div
            class="text-lg flex items-center justify-center  px-5 py-4 h-full bg-darkred-dark text-darkred-light rounded-lg">
            {{ entity_name }}: {{ value }}
        </div>
        <button @click="value++"
            class="flex items-center justify-center text-5xl p-4  bg-darkred-red text-darkred-light rounded-md transition-all duration-300 ease-in-out hover:bg-darkred-bright hover:shadow-lg hover:scale-105 active:scale-95">
            <PlusIcon class="w-8 h-8" />
        </button>
    </div>
</template>