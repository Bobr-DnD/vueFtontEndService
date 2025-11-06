<script setup>
import { ArrowUpTrayIcon } from '@heroicons/vue/24/solid';

const props = defineProps({

})

</script>

<template>
    <div class="flex flex-col justify-center space-y-2">
        <img class="object-cover rounded-xl border-4 border-darkred-red shadow-md"
            src="https://placehold.co/400x200?text=Character" alt="Character image" />
        <button class="flex items-center justify-center gap-2 px-5 py-3 font-gothic text-lg font-semibold
         text-darkred-light bg-darkred-dark_gray border-2 border-darkred-dark rounded-xl">
            <ArrowUpTrayIcon class="w-6 h-6" />
            Завантажити зображення
        </button>
    </div>
</template>