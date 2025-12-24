<script setup>

const props = defineProps({
    quest: {
        type: Object,
        required: true
    }
})

</script>

<template>

    <div class="p-3 rounded-2xl bg-darkred-dark text-darkred-light flex flex-col gap-2">
        <div class="text-xl font-medium">
            {{ props.quest.name }}
        </div>

        <div>
            Опис: {{ props.quest.description }}
        </div>

        <div>
            Винагорода: {{ props.quest.reward }}
        </div>
    </div>

</template>