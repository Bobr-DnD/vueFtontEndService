<script setup>
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';

const props = defineProps({
    perk: {
        type: Object,
        required: true
    },
    callback_close: {
        type: Function,
        required: true
    }
})
</script>

<template>

    <div @click="props.callback_close"
        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">
        
        <div @click.stop
            class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

            <CloseButtonRedBG @click="props.callback_close" />

            <div v-if="props.perk.type" class="p2 text-clip w-[90%]">Назва: {{ props.perk.name }} <sup
                    :style="{ color: props.perk.type.color }">{{ props.perk.type.name }}</sup></div>

            <div v-else class="p2 text-clip w-[90%]">Назва: {{ props.perk.name }}</div>

            <div class="flex flex-col gap-1">
                <div class="font-normal">
                    Рівні перку:
                </div>
                <div class="font-normal" v-for="description, index in props.perk.descriptions"
                    :key="Math.random().toString(24).slice(2)">
                    {{ index + 1 }} -> {{ description }}
                </div>
            </div>

            <div v-if="props.perk.requirement">
                {{ props.perk.requirement }}
            </div>

        </div>
    </div>

</template>