<script setup>
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    weapon: {
        type: Object, required: true
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
    <div v-if="props.weapon.count" class="text-darkred-light row-span-3">×{{ props.weapon.count }}</div>

    <div class="col-span-3 p2 text-clip">
        {{ props.weapon.name }}

    </div>

    <DeleteButton v-if="props.removable" :disabled="!props.removable"
        :class="false ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
        @click.stop="props.callback(props.weapon.id)" class="row-span-3 w-full" />

    <div v-if="props.weapon.damage.length > 0" class="col-span-2 p2 text-clip">Урон: {{ props.weapon.damage[0].damage }}
    </div>
    <div v-else class="col-span-2 p2 text-clip">Урон відсутній</div>

    <div v-if="props.weapon.actionPoints.min !== null" class="p2 text-clip">Очки дії: {{
        props.weapon.actionPoints.min }}-{{ props.weapon.actionPoints.max }}</div>
    <div v-else class="p2 text-clip">Очки дії: {{ props.weapon.actionPoints.max }}</div>

    <div v-if="props.weapon.requirement" class="col-span-3 p2 text-clip">Вимоги:
        {{Object.entries(props.weapon.requirement).map(([key, value]) =>
            `${key}:${value}`).join(',')}}</div>

    <div v-else class="col-span-3 p2 text-clip">Вимоги відсутні</div>
</template>