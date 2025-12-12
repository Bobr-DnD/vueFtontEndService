<script setup>

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
        class="sticky top-0 w-64 h-screen bg-darkred-dark border-l-2 border-darkred-red shadow-[0_0_25px_rgba(0,0,0,0.8)] flex flex-col items-center py-6 px-4 font-univers overflow-y-auto">
        <div class="flex flex-col items-center w-full mb-6">
            <h2 class="text-darkred-light text-lg font-bold mb-3 text-center">
                {{ session_name }}
            </h2>
            <img class="w-full h-40 object-cover border-4 border-darkred-bright rounded-lg shadow-lg"
               :src="props.session_image ? props.session_image : 'https://placehold.co/400x200?text=Session'" alt="Session image" />
        </div>

        <hr class="w-full h-[2px] bg-darkred-red border-0 mb-6" />

        <div class="flex flex-col gap-3 w-full">
            <button v-for="entity in entities" :key="Math.random().toString(24).slice(2)"
                class="w-full text-left px-4 py-2 rounded-md bg-darkred-bright text-darkred-dark md:hover:bg-darkred-red md:hover:text-white transition-all duration-300 shadow-md">
                {{ entity }}
            </button>
        </div>
    </aside>
</template>

<style scope></style>