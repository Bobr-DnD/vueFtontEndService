<script setup>
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

const props = defineProps({
    exp: { type: Number, required: true },
    expMax: { type: Number, required: true },
    perkPoints: { type: Number, required: true },
    level: {type: Number, required: true },
    callback: { type: Function, required: true }
})
</script>

<template>
    <div class="flex flex-wrap items-stretch justify-start gap-1 text-brand-text">

        <div class="grow">
            <div
                class="p-2 flex items-center justify-center h-full w-full text-mb font-medium font-gothic border-2 rounded-md border-brand-muted">
                Рівень: {{ props.level }}
            </div>
        </div>

        <div class="grow">
            <div
                class="p-2 flex items-center justify-center h-full w-full text-mb font-medium font-gothic border-2 rounded-md border-brand-muted">
                Очки рівня: {{ props.perkPoints }}
            </div>
        </div>

        <div class="grow md:w-auto w-1/2">
            <ProgressiveBar :value="props.exp" :valueMax="props.expMax" text="Досвід"/>
        </div>

        <div class="grow"> <button @click="callback()" class="w-full h-full p-2 rounded-lg border-2 border-brand-base bg-brand-subtle 
                text-brand-ink text-xl font-semibold tracking-wide md:hover:bg-brand-accent md:hover:text-brand-text active:bg-brand-accent-hover active:scale-95 
                transition-all duration-200 ease-in-out shadow-md md:hover:shadow-lg">
                +1 досвід </button> </div>
    </div>
</template>