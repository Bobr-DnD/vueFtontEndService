<script setup>
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

const props = defineProps({
    exp: { type: Number, required: true },
    expMax: { type: Number, required: true },
    perkPoints: { type: Number, required: true },
    callback: { type: Function, required: true }
})
</script>

<template>
    <div class="flex flex-wrap items-stretch justify-start">

        <div class="p-1 grow">
            <div
                class="p-2 flex items-center justify-center h-full w-full text-mb font-medium font-gothic border-2 rounded-md border-darkred-dark">
                Очки рівня: {{ props.perkPoints }}
            </div>
        </div>

        <div class="p-1 grow">
            <ProgressiveBar :value="props.exp" :valueMax="props.expMax" text="Досвід" />
        </div>

        <div class="p-1 grow"> <button @click="callback()" class="w-full h-full p-2 rounded-lg border-2 border-darkred-red bg-darkred-dark_gray 
                text-darkred-light font-semibold tracking-wide md:hover:bg-darkred-red md:hover:text-darkred-light active:bg-darkred-bright active:scale-95 
                transition-all duration-200 ease-in-out shadow-md md:hover:shadow-lg">
                +1 досвід </button> </div>
    </div>
</template>