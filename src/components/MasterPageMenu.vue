<script setup>
import { defineProps, defineModel } from 'vue';

const props = defineProps({
    session_name: {
        type: String,
        required: true
    },
    session_image: {
        type: String,
        required: true
    },
    entities: {
        type: Array,
        reqiured: true
    }
})
</script>

<template>
        <aside
            class="fixed right-0 top-16 w-64 h-[calc(100vh-4rem)] bg-fallout-blackish border-l-2 border-fallout-red shadow-[0_0_25px_rgba(0,0,0,0.8)] flex flex-col items-center py-6 px-4 font-univers overflow-y-auto z-50">

            <div class="flex flex-col items-center w-full mb-6">
                <h2 class="text-fallout-sand text-lg font-bold mb-3 text-center">
                    {{ session_name }}
                </h2>
                <img class="w-full h-40 object-cover border-4 border-fallout-brown rounded-lg shadow-lg"
                    src="https://placehold.co/400x200?text=Session" alt="Session image" />
            </div>

            <hr class="w-full h-[2px] bg-fallout-red border-0 mb-6" />

            <div class="flex flex-col gap-3 w-full">
                <button v-for="entity in entities" :key="entity"
                    class="w-full text-left px-4 py-2 rounded-md bg-fallout-brown text-fallout-sand hover:bg-fallout-red hover:text-white transition-all duration-300 shadow-md">
                    {{ entity }}
                </button>
            </div>
        </aside>
</template>



<style scope></style>