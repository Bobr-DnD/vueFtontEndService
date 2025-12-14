<script setup>
import DeleteButton from '../reusable/Buttons/DeleteButton.vue';

const props = defineProps({
    effects: {
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
    <div class="space-y-2 font-univers">

        <div class="grid px-4 py-2 gap-2 justify-items-center items-center bg-darkred-dark_gray  
                border-darkred-gray rounded-xl shadow-sm text-darkred-light"
            :class="props.removable ? 'grid-cols-[1fr_1fr_40px]' : 'grid-cols-[1fr_1fr]'">
            <div>
                Назва
            </div>
            <div>
                Ефект
            </div>
        </div>

        <div v-for="effect in props.effects" :key=effect.id class="grid gap-2 px-4 py-2 justify-items-center items-center
         bg-darkred-dark_gray  border-darkred-gray rounded-xl shadow-sm text-darkred-light"
            :class="props.removable ? 'grid-cols-[1fr_1fr_40px]' : 'grid-cols-[1fr_1fr]'">

            <div class="text-lg font-semibold">
                {{ effect.name }}
            </div>

            <div class="text-sm">
                {{ effect.description }}
            </div>

            <DeleteButton @click="props.callback(effect.id)" v-if="props.removable" class="bg-darkred-red" />
        </div>
    </div>
</template>