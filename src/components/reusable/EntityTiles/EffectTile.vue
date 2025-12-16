<script setup>

const props = defineProps({
    effect: {
        type: Object,
        required: true
    }
})

</script>

<template>

    <div class="p-3 rounded-2xl bg-darkred-dark text-darkred-light flex flex-col gap-2">
        <div>
            Назва: {{ props.effect.name }}
        </div>

        <div>
            Опис: {{ props.effect.description }}
        </div>

        <div v-if="props.effect.effect">
            Вплив ефекту на поля: {{ Object.entries(props.effect.effect).map(([key, value]) => `${key}: ${value}`).join(', ') }}
        </div>
    </div>

</template>