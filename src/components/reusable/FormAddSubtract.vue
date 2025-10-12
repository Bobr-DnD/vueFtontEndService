<script setup>
import { onMounted, watch } from 'vue'
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    entity_name: {
        type: String,
        required: true
    },
    default_number: {
        type: Number,
        required: false,
        default: 1
    }

})

const emit = defineEmits(['updateValue'])

let input = null

onMounted(() => {
    input = document.getElementById(props.entity_name)

})

function changeValue(operation) {

    switch (operation) {
        case 'plus':
            emit('updateValue', props.entity_name, parseInt(input.value))
            break;
        case 'minus':
            emit('updateValue', props.entity_name, -parseInt(input.value))
            break;
    }
}
</script>

<template>
    <div class="flex flex-wrap items-center justify-start mb-2 border rounded-lg">

        <div class="p-2 w-fit text-darkred-dark font-semibold text-md">{{ entity_name.toUpperCase() }}: {{ value }}
        </div>

        <form @submit.prevent class="flex grow justify-end items-center p-4 font-univers rounded-lg">
            <input :id="entity_name" type="number" :value="default_number" class="no-arrows bg-darkred-dark_gray max-w-16 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
        </form>

        <section class="flex items-center justify-end">

            <button class="p-2">
                <PlusIcon @click="changeValue('plus')"
                    class="w-10 h-10 p-2 border-2 bg-darkred-dark text-darkred-light border-darkred-red rounded-lg" />
            </button>

            <button class="p-2">
                <MinusIcon @click="changeValue('minus')"
                    class="w-10 h-10 p-2 border-2 bg-darkred-dark text-darkred-light border-darkred-red rounded-lg" />
            </button>

        </section>
    </div>


</template>