<script setup>
import DeleteButton from '../reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    quests: {
        type: Object,
        required: true
    },
    removable: {
        type: Boolean,
        default: false
    },
    callback: {
        type: Function,
        default: () => console.log('There is nothing to click')
    }
})


</script>

<template>
    <div class="flex flex-col gap-2">
        <div v-for="quest in props.quests" :key="quest.id"
            class="grid border-2 rounded-lg border-darkred-light_gray p-2 font-gothic overflow-hidden text-ellipsis"
            :class="props.removable ? 'grid-cols-[1fr_40px]' : 'grid-cols-1'">

            <div>
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

                <div v-for="step in quest.steps" :key="Math.random().toString(24).slice(2)"
                    class="text-lg font-normal indent-4">

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

            <DeleteButton v-if="props.removable" class="self-center w-10 h-16 bg-darkred-red text-darkred-light" @click="props.callback(quest.id)" />

        </div>

    </div>

</template>