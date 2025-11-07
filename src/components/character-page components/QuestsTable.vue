<script setup>

const props = defineProps({
    quests: {type: Object, required: true}
})


</script>

<template>
    <div class="border-2 rounded-lg border-darkred-dark_gray p-1">

        <div class="w-full text-center text-2xl font-semibold font-gothic">
            {{ props.quest.name }}
        </div>

        <div v-for="step in props.quest.steps" class="text-md font-univers font-medium">

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