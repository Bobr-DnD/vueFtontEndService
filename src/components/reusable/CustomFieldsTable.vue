<script setup>
import { ref } from 'vue';zw0wq2wq
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import PlusButton from './PlusButton.vue';
import { toCustomFieldObjectField } from '/utils/objects.dto';
import ObjectFieldsEditor from './ObjectFieldsEditor.vue';

const props = defineProps({
    fields: { type: Object, required: true },
    callback: { type: Function, required: true }
})

let modal_hidden = ref(true)

function updateFields(name, value) {
    if (typeof (value) === 'string') props.fields[name] = value
    else props.fields[name] += value
    props.callback(props.fields)
}

function addCustomField(name, value) {
    Object.assign(props.fields, toCustomFieldObjectField({ name, value }))
    props.callback(props.fields)
}
</script>

<template>

    <div v-for="value, name in props.fields">
        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + name" :entity_name="name"
            :value="props.fields[name]" :callback="updateFields"
            class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

        <FormAddSubtract v-if="typeof (value) === 'number'" :label="'CustomFields_' + name" :entity_name="name"
            :value="props.fields[name]" :callback="updateFields"
            class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

    </div>

    <PlusButton @click="modal_hidden = !modal_hidden" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg 
           transition-all duration-300 ease-out hover:cursor-pointer
           bg-gradient-to-br from-darkred-dark to-darkred-light
           hover:from-darkred-red hover:to-darkred-dark relative overflow-hidden group" />

    <ObjectFieldsEditor v-if="!modal_hidden" :name="'CustomFields_'" :fields="props.fields" :callback="addCustomField"/>

</template>