<script setup>
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    perk: {
        type: Object,
        required: true
    }
})
</script>

<template>
        <div v-if="props.perk.type === 'perk'" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                class="text-greenish-mid">Перк</sup></div>
        <div v-if="props.perk.type === 'antiperk'" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                class="text-darkred-bright">Антиперк</sup></div>
        <div v-if="props.perk.type === 'status'" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                class="text-orange-gold">Статус</sup></div>
        <div v-if="props.perk.type === 'skill'" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                class="text-orange-orange">Навичка</sup></div>

        <div class="flex flex-col gap-1">
            <div class="font-normal">
                Рівні перку:
            </div>
            <div class="font-normal" v-for="description, index in props.perk.descriptions" :key="Math.random().toString(24).slice(2)">
                {{ index+1 }} -> {{ description }}
            </div>
        </div>

        <div v-if="props.perk.requirement">
            {{ props.perk.requirement }}
        </div>

</template>