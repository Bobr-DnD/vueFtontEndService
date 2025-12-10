<script setup>
import { onMounted } from 'vue'
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    value: {
        type: Number,
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
    },
    callback: {
        type: Function,
        required: true
    }

})

let input = null

onMounted(() => {
    input = document.getElementById(props.entity_name)

})

function changeValue(operation) {

    switch (operation) {
        case 'plus':
            props.callback(props.entity_name, parseInt(input.value))
            break;
        case 'minus':
            props.callback(props.entity_name, -parseInt(input.value))
            break;
    }
}
</script>

<template>
    <div class="grid grid-cols-[1fr_104px] font-gothic p-2 gap-2">
        <label :for="entity_name" class="w-full col-span-2 overflow-hidden text-ellipsis text-darkred-dark font-semibold text-lg tracking-wide">{{
            entity_name.toUpperCase() }}: {{ value }}</label>
        <section class="">

            <form @submit.prevent class="flex flex-col items-start justify-center w-full font-gothic rounded-lg">
                <input :id="entity_name" type="number" :value="default_number" class="no-arrows h-11 bg-darkred-dark_gray w-full text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
            </form>

        </section>

        <section class="flex items-center justify-center gap-2 self-end">

            <button class="">
                <PlusIcon @click="changeValue('plus')"
                    class="w-11 h-11 p-2 border-2 bg-darkred-dark text-darkred-light border-darkred-red rounded-lg" />
            </button>

            <button class="">
                <MinusIcon @click="changeValue('minus')"
                    class="w-11 h-11 p-2 border-2 bg-darkred-dark text-darkred-light border-darkred-red rounded-lg" />
            </button>

        </section>
    </div>


</template>