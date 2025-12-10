<script setup>

const props = defineProps({
    quests: { type: Object, required: true }
})


</script>

<template>
    <div v-for="quest in props.quests"
        class="border-2 rounded-lg border-darkred-light_gray p-2 font-gothic overflow-hidden text-ellipsis">
        <div class="flex flex-col gap-1">
            <div class="w-full text-center text-2xl font-semibold">
                {{ quest.name }}
            </div>
            <div class="w-full text-xl font-normal">
                Опис: {{ quest.description }}
            </div>
            <div class="w-full text-xl font-normal">
                Винагорода: {{ quest.reward }}
            </div>
            <div v-if="quest.steps.length !== 0" class="w-full text-xl font-normal">
                Кроки:
            </div>
        </div>

        <div v-for="step in quest.steps" class="text-lg font-normal indent-4">

            <div v-if="step.status === 'fail'">
                • <span class="line-through decoration-2 decoration-darkred-red">{{ step.name }}</span>
            </div>

            <div v-if="step.status === 'done'">
                • <span class="line-through decoration-2 decoration-darkred-dark">{{ step.name }}</span>
            </div>

            <div v-if="step.status === 'active'" class="">
                • {{ step.name }}
            </div>

        </div>

    </div>
</template>