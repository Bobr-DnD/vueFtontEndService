<script setup>
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    inv: {
        type: Object,
        required: true
    },
    removable: {
        type: Boolean,
        required: false,
        default: true
    },
    callback: {
        type: Function,
        required: false,
        default: () => { console.log('Button is inactive, How tf did you clicked that?!') }
    }
})
</script>

<template>
    <div v-if="props.inv.count" class="text-darkred-light">×{{ props.inv.count }}</div>

    <div class="p2 text-clip">{{ props.inv.name }}</div>

    <div class="p2 text-clip">Ціна: {{ props.inv.price }}</div>

    <DeleteButton v-if="props.removable" :disabled="!props.removable"
        :class="false ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
        @click.stop="props.callback(inv.id)" class="w-full" />
</template>