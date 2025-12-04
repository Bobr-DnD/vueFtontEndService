<script setup>
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    armor: {
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
        requied: false,
        default: () => { console.log('Button is inactive, How tf did you clicked that?!') }
    }
})
</script>

<template>
    <div v-if="props.armor.count" class="text-darkred-light row-span-3">×{{ props.armor.count }}</div>

    <div class="col-span-5 p2 text-clip">{{ props.armor.name }}</div>

    <DeleteButton v-if="props.removable" :disabled="!props.removable"
        :class="false ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
        @click.stop="callback(props.armor.id)" class="row-span-3 w-full" />

    <div v-if="props.armor.requirement" class="col-span-3 p2 text-clip">Вимоги:
        {{Object.entries(props.armor.requirement).map(([key, value]) =>
            `${key}:${value}`).join(', ')}}</div>

    <div v-else class="col-span-3 p2 text-clip">Вимоги відсутні</div>

    <div class="col-span-2 p2 text-clip">Захист: {{ props.armor.resist }}</div>

    <div v-if="props.armor.effect" class="col-span-2 p2 text-clip">Ефект: {{ props.armor.effect }}</div>

    <div v-else class="col-span-5 p2 text-clip">Ефект відсутній</div>
</template>