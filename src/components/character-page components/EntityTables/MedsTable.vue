<script setup>
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    med: {
        type: Object,
        required: true
    },
    usable: {
        type: Boolean,
        required: false,
        default: true
    },
    removable: {
        type: Boolean,
        required: false,
        default: true
    },
    callbackDelete: {
        type: Function,
        required: false,
        default: () => { console.log('Button is inactive, How tf did you clicked that?!') }
    },
    callbackUse: {
        type: Function,
        required: false,
        default: () => { console.log('This one also disabled, man, stop)') }
    }
})
</script>


<template>
    <div v-if="props.med.count" class="text-darkred-light">×{{ props.med.count }}</div>

    <div class="p2 text-clip">{{ props.med.name }}</div>

    <div class="p2 text-clip">{{ props.med.description }}</div>

    <ApproveButton v-if="props.usable && med.effect" @click.stop="props.callbackUse(props.med.id, props.med.effect.id)" class="w-full" />
    <DeleteButton v-if="props.removable" :disabled="!props.removable"
        :class="false ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
        @click.stop="props.callbackDelete(props.med.id)" class="w-full" />
</template>