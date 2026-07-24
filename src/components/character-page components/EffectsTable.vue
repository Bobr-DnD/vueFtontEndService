<script setup>
import DeleteButton from '../reusable/Buttons/DeleteButton.vue';
import ApproveButton from '../reusable/Buttons/ApproveButton.vue';

const props = defineProps({
    effects: {
        type: Array,
        required: true
    },
    removable: {
        type: Boolean,
        default: false
    },
    addable: {
        type: Boolean,
        default: false
    },
    callback_remove: {
        type: Function,
        default: () => console.log('There is nothing to click')
    },
    callback_add: {
        type: Function,
        default: () => console.log('There is nothing to click')
    }
})

</script>

<template>
    <div class="space-y-2 font-univers">

        <div class="grid px-4 py-2 gap-2 justify-items-center items-center bg-darkred-dark_gray
                border-darkred-gray rounded-xl shadow-sm text-darkred-light"
            :class="props.removable || props.addable ? 'grid-cols-[1fr_1fr_40px]' : 'grid-cols-[1fr_1fr]'">
            <div>
                Назва
            </div>
            <div>
                Ефект
            </div>
        </div>

        <div v-for="effect in props.effects" :key=effect.id class="grid gap-2 px-4 py-2 justify-items-center items-center
         bg-darkred-dark_gray  border-darkred-gray rounded-xl shadow-sm text-darkred-light"
            :class="[
                props.removable || props.addable ? 'grid-cols-[1fr_1fr_40px]' : 'grid-cols-[1fr_1fr]',
                props.removable ? 'border-l-4 border-l-greenish-mid' : '',
                props.addable ? 'border-l-4 border-l-darkred-gray' : ''
            ]">

            <div class="text-lg font-semibold">
                {{ effect.name }}
            </div>

            <div class="text-sm">
                {{ effect.description }}
            </div>

            <DeleteButton @click="props.callback_remove(effect)" v-if="props.removable" class="bg-darkred-red" />

            <ApproveButton @click="props.callback_add(effect)" v-if="props.addable" />
        </div>
    </div>
</template>