<script setup>
import { ref } from 'vue';
import HideButton from '../reusable/HideButton.vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import ApproveButton from './ApproveButton.vue';
import { ChartBarIcon } from '@heroicons/vue/24/solid';
import PlusButton from './PlusButton.vue';
import { toCustomFieldObjectField } from '/utils/objects.dto';

const props = defineProps({
    fields: { type: Object, required: true },
    callback: { type: Function, required: true }
})

let custom_hidden = ref(true)
let modal_hidden = ref(true)
let value_field_string = ref(true)

function updateFields(name, value) {
    if (typeof (value) === 'string') props.fields[name] = value
    else props.fields[name] += value
    props.callback(props.fields)
}

function switchTypeField(event) {
    if (event.target.innerText === 'Текст') {
        event.target.innerText = 'Число'
        value_field_string.value = false
    }
    else {
        event.target.innerText = 'Текст'
        value_field_string.value = true
    }
}

function addCustomField() {
    const name = document.getElementById('CustomFieldsName').value
    let value

    if (!value_field_string.value) value = parseInt(document.getElementById('CustomFieldsValue').value)
    else value = document.getElementById('CustomFieldsValue').value

    Object.assign(props.fields, toCustomFieldObjectField({ name, value }))

    props.callback(props.fields)
}
</script>

<template>
    <HideButton textShow="Показати додаткові характеристики" textHide="Приховати додаткові характеристики"
        v-model:hidden="custom_hidden" :mainIcon="ChartBarIcon" />

    <div v-if="!custom_hidden" v-for="value, name in props.fields">
        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + name" :entity_name="name"
            :value="props.fields[name]" :callback="updateFields"
            class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

        <FormAddSubtract v-if="typeof (value) === 'number'" :label="'CustomFields_' + name" :entity_name="name"
            :value="props.fields[name]" :callback="updateFields"
            class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

    </div>

    <PlusButton v-if="!custom_hidden" @click="modal_hidden = !modal_hidden" class="w-16 mx-auto text-center border-4 border-darkred-dark rounded-lg 
           transition-all duration-300 ease-out hover:cursor-pointer
           bg-gradient-to-br from-darkred-dark to-darkred-light
           hover:from-darkred-red hover:to-darkred-dark relative overflow-hidden group" />

    <div v-if="!modal_hidden" class="w-full">
        <form @submit.prevent
            class="flex w-full items-center justify-start space-x-4 p-2 font-univers mb-2  rounded-xl">
            <label for="CustomFieldsName" class="mr-2 w-24 text-darkred-dark font-semibold text-lg tracking-wide">
                Назва:
            </label>
            <input id="CustomFieldsName" type="text" value="Назва поля" class="bg-darkred-gray max-w-32 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
        </form>

        <form @submit.prevent class="flex w-full items-center justify-start space-x-4 p-2 font-univers mb-2 rounded-xl">
            <label for="CustomFieldsValue" class="mr-2 w-24 text-darkred-dark font-semibold text-lg tracking-wide">
                Значення:
            </label>
            <input v-if="value_field_string" id="CustomFieldsValue" type="text" value="Значення" class="bg-darkred-gray max-w-32 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
            <input v-if="!value_field_string" id="CustomFieldsValue" type="number" value="0" class="bg-darkred-gray max-w-32 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
            <button @click="switchTypeField($event)"
                class="p-2 w-20 border-2 rounded-lg border-darkred-dark">Текст</button>
        </form>

        <ApproveButton @click="addCustomField" class="w-32 mx-auto text-2xl" />

    </div>


</template>