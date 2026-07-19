<script setup>
import { ref } from 'vue'
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'
import { returnIcon } from '@utils/icons'

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
    },
    icon: {
        type: String,
        default: null
    }

})

const input = ref(null)

function changeValue(operation) {

    const value = parseInt(input.value.value) || 1

    switch (operation) {
        case 'plus':
            props.callback(props.entity_name, value)
            break;
        case 'minus':
            props.callback(props.entity_name, -value)
            break;
    }
}
</script>

<template>
    <div class="grid grid-cols-[1fr_104px] font-gothic p-2 gap-2">

        <label :for="entity_name"
            class="w-full col-span-2 flex gap-2 overflow-hidden text-ellipsis text-darkred-dark font-semibold text-lg tracking-wide">

            <span v-if="props.icon">
                <component :is="returnIcon(props.icon).icon" class="w-6 h-6" />
            </span>

            {{ entity_name.toUpperCase() }}: {{ value }}</label>

        <div class=" col-span-full text-darkred-dark font-medium text-md">Додати\Відняти від значення:</div>
        <section>

            <form @submit.prevent class="flex gap-2 flex-col items-start justify-center w-full font-gothic rounded-lg">
                <input ref="input" :id="entity_name" type="number" :value="default_number" class="no-arrows h-11 bg-darkred-dark_gray w-full text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
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