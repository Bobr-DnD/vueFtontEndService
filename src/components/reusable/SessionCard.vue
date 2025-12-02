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
    <div class="flex flex-col items-center justify-center min-h-lg">
        <div
            class="max-w-sm w-full m-6 rounded-xl shadow-lg overflow-hidden border-4 border-darkred-red bg-darkred-dark">
            <div class="relative">
                <img class="w-full h-auto object-cover object-top border-b-4 border-darkred-light"
                    :src="props.session.image ? props.session.image : 'https://placehold.co/400x200?text=Session'" alt="Session image" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"></div>
            </div>

            <div class="p-4 space-y-4 text-darkred-light">
                <h2 class="text-2xl tracking-wide text-center text-darkred-light font-gothic drop-shadow-md">
                    {{ session.name }}
                </h2>

                <button @click="toggleMode"
                    class="w-full text-md font-medium font-gothic py-2 px-3 rounded-lg bg-darkred-red md:hover:bg-darkred-bright transition-colors  tracking-wide shadow-md">
                    Режим: <span class="capitalize">{{ mode }}</span>
                </button>

                <RouterLink :to="url"
                    class="w-full text-lg font-medium font-gothic inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-darkred-red md:hover:bg-darkred-bright active:bg-darkred-dark text-white tracking-wide shadow-lg transition-all duration-200 ease-in-out">
                    Зайти
                </RouterLink>
            </div>
        </div>
    </div>


</template>