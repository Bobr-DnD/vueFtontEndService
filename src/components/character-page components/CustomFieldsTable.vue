<script setup>
import { ref } from 'vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import { ChartBarIcon, ChevronDoubleUpIcon } from '@heroicons/vue/24/solid';

const emit = defineEmits(['updateFields'])

const props = defineProps({
    fields: { type: Object, required: true }
})

let customFields_text = ref('Показати додаткові характеристики')
let custom_hidden = ref(true)

function updateFields(name, value){
    if(typeof(value) === 'string') props.fields[name] = value
    else props.fields[name] += value
    emit('updateFields', props.fields)
}
</script>

<template>
    <h2 @click="custom_hidden = !custom_hidden;
    customFields_text === 'Показати додаткові характеристики'
        ? customFields_text = 'Приховати додаткові характеристики'
        : customFields_text = 'Показати додаткові характеристики'" class="px-4 py-2 text-center text-xl font-univers font-semibold text-ellipsis mb-2 rounded-lg hover:cursor-pointer transition-all duration-500 
                ease-in-out select-none grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
        :class="custom_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

        <ChartBarIcon class="w-8 h-8" />
        {{ customFields_text }}
        <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
            :class="custom_hidden ? 'rotate-180' : 'rotate-0'" />
    </h2>

    <div v-if="!custom_hidden" v-for="value, field in props.fields">
        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + field" :entity_name="field" :value="props.fields[field]" 
        @updateValue="updateFields" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />

        <FormAddSubtract v-if="typeof (value) === 'number'" :label="'CustomFields_' + field" :entity_name="field" :value="props.fields[field]" 
        @updateValue="updateFields" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]"/>

    </div>
</template>