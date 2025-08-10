<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
    session: {
        type: Object,
        required: true
    },
    id: {
        type: String,
        required: true
    }
})

let url = `/session/${props.id}`

const mode = ref('гравець')

function toggleMode() {
    if (mode.value === 'гравець') {
        url = `/admin/${props.id}`
        mode.value = 'майстер'
    }
    else {
        url = `/session/${props.id}`
        mode.value = 'гравець'
    }
}

</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-lg font-univers">
        <div
            class="max-w-sm w-full m-6 rounded-xl shadow-lg overflow-hidden border-4 border-fallout-brown bg-fallout-blackish">
            <!-- Image -->
            <div class="relative">
                <img class="w-full h-40 object-cover border-b-4 border-fallout-brown"
                    src="https://placehold.co/400x200?text=Session" alt="Session image" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"></div>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-4 text-fallout-sand">
                <h2 class="text-2xl font-gothic tracking-wide text-center text-fallout-red drop-shadow-md">
                    {{ session.name }}
                </h2>

                <!-- Mode Toggle -->
                <button @click="toggleMode"
                    class="w-full py-2 px-3 rounded-lg bg-fallout-dark hover:bg-fallout-red transition-colors font-arialblack tracking-wide shadow-md">
                    Режим: <span class="capitalize">{{ mode }}</span>
                </button>

                <!-- Enter Button -->
                <RouterLink :to="url"
                    class="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-fallout-red hover:bg-fallout-sand hover:text-fallout-blackish active:bg-fallout-dark text-white font-arialblack tracking-wide shadow-lg transition-all duration-200 ease-in-out">
                    Зайти
                </RouterLink>
            </div>
        </div>
    </div>

</template>