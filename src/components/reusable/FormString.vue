<script setup>
import ApproveButton from './ApproveButton.vue';

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
    props.callback(props.entity_name, value)
}
</script>

<template>
    <form @submit.prevent class="grid grid-cols-[50%_35%_10%] gap-2 items-center p-4 font-univers mb-2  rounded-xl">
        <label :for="entity_name" class="w-full text-darkred-dark font-semibold text-lg tracking-wide">
            {{ entity_name }}:
        </label>
        <input :id="entity_name" type="text" :value="value" class="w-full bg-darkred-gray text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />

        <ApproveButton @click="changeValue" class="w-full flex justify-center items-center" />
    </form>


</template>