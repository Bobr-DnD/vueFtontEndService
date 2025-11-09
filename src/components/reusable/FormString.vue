<script setup>
import { ref } from 'vue';
import ApproveButton from './Buttons/ApproveButton.vue';

let textEl = ref('')

const props = defineProps({
    value: {
        type: String,
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
    callback: {
        type: Function,
        required: true
    }
})

function changeValue() {

    props.callback(props.entity_name, textEl.value.value)
}
</script>

<template>
    <form @submit.prevent class="grid grid-cols-[1fr_44px] gap-2 items-center p-2 font-gothic rounded-xl">

        <section class="flex flex-col items-start justify-center w-full">
            <label :for="entity_name" class="w-full text-darkred-dark font-semibold text-lg tracking-wide">
                {{ entity_name.toUpperCase() }}:
            </label>
            <input :ref="'textEl'" :id="entity_name" type="text" :value="value"
                class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
        </section>


        <ApproveButton @click="changeValue" class="w-11 h-11 flex justify-center text-xl items-center self-end" />
    </form>


</template>