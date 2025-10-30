<script setup>
import { ref } from 'vue';
import HideButton from '../reusable/HideButton.vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import { ChartBarIcon } from '@heroicons/vue/24/solid';
import PlusButton from './PlusButton.vue';

const props = defineProps({
    fields: { type: Object, required: true },
    callback: {type: Function, required: true}
})

let custom_hidden = ref(true)
let modal_hidden = ref(true)

function updateFields(name, value){
    if(typeof(value) === 'string') props.fields[name] = value
    else props.fields[name] += value
    props.callback(props.fields)
}

function showModal(){
    modal_hidden.value = !modal_hidden.value
    console.log(modal_hidden.value);
    
}
</script>

<template>
    <HideButton textShow="Показати додаткові характеристики" textHide="Приховати додаткові характеристики" v-model:hidden="custom_hidden" :mainIcon="ChartBarIcon"/>

    <div v-if="!custom_hidden" v-for="value, name in props.fields">
        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + name" :entity_name="name" :value="props.fields[name]" 
        :callback="updateFields" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

        <FormAddSubtract v-if="typeof (value) === 'number'" :label="'CustomFields_' + name" :entity_name="name" :value="props.fields[name]"
        :callback="updateFields" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]"/>

        <PlusButton @click="showModal" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg 
           transition-all duration-300 ease-out
           hover:scale-110 hover:border-darkred-red hover:shadow-[0_0_15px_#8E1616] hover:cursor-pointer
           bg-gradient-to-br from-darkred-dark to-darkred-light
           hover:from-darkred-red hover:to-darkred-dark relative overflow-hidden group"/>

    </div>

    <div>
        <form action=""></form>
    </div>


</template>