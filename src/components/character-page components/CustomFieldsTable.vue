<script setup>
import { ref } from 'vue';
import HideButton from '../reusable/HideButton.vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import { ChartBarIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    fields: { type: Object, required: true },
    callback: {type: Function, required: true}
})

let custom_hidden = ref(true)

function updateFields(name, value){
    if(typeof(value) === 'string') props.fields[name] = value
    else props.fields[name] += value
    props.callback(props.fields)
}
</script>

<template>
    <HideButton textShow="Показати додаткові характеристики" textHide="Приховати додаткові характеристики" v-model:hidden="custom_hidden" :mainIcon="ChartBarIcon"/>

    <div v-if="!custom_hidden" v-for="value, field in props.fields">
        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + field" :entity_name="field" :value="props.fields[field]" 
        @updateValue="updateFields" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

        <FormAddSubtract v-if="typeof (value) === 'number'" :label="'CustomFields_' + field" :entity_name="field" :value="props.fields[field]"
        @updateValue="updateFields" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]"/>

    </div>
</template>