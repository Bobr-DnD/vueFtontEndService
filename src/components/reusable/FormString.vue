<script setup>
import ApproveButton from './ApproveButton.vue';

const emit = defineEmits(['updateValue'])

const props = defineProps({
    value:{
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
    }
})

function changeValue(){
    const value = document.getElementById(props.entity_name).value
    emit('updateValue', props.entity_name, value)
}
</script>

<template>
    <form @submit.prevent class="flex items-center max-w-80 p-4 font-univers mb-2  rounded-xl">
        <label :for="entity_name" class="mr-2 w-full text-darkred-dark font-semibold text-lg tracking-wide">
            {{ entity_name }}:
        </label>
        <input :id="entity_name" type="text" :value="value" class="bg-darkred-gray max-w-28 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
        
        <ApproveButton @click="changeValue" class="w-16 flex justify-center items-center ml-2"/>
    </form>


</template>