<script setup>
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    perk: {
        type: Object,
        required: true
    },
    callback: {
        type: Function,
        required: false,
        default: () => { console.log('Button is inactive, How tf did you clicked that?!') }
    },
    removable: {
        type: Boolean,
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

    <DeleteButton v-if="props.removable" :disabled="!props.removable"
        :class="!props.removable ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
        class="flex justify-center row-span-2 h-min-full h-max-12 self-center items-center text-xl w-11"
        @click="props.callback(props.perk)" />

    <div class="p2 text-clip">Опис: {{ props.perk.descriptions[props.perk.count - 1] }}</div>
</template>