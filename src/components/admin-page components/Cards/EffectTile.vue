<script setup>
import { checkObjectFieldExisting } from '@utils/entityHelper';

const props = defineProps({
    effect: {
        type: Object,
        required: true
    }
})

</script>

<template>

    <div class="p-3 rounded-2xl bg-brand-base text-brand-text flex flex-col gap-2">
        <div class="pl-2 text-xl font-medium">
            {{ props.effect.name }}
        </div>

        <div class="p-2 bg-brand-surface rounded-lg">
            Опис: {{ props.effect.description }}
        </div>

        <div v-if="checkObjectFieldExisting(props.effect.effect)" class="p-2 bg-brand-surface rounded-lg">
            Вплив ефекту на поля: {{Object.entries(props.effect.effect).map(([key, value]) => `${key}:
            ${value}`).join(', ') }}
        </div>
    </div>

</template>