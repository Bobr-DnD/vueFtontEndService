<script setup>
import ImportantField from '../ImportantField.vue';

const value = defineModel('inputValue', { type: [String, Number], required: true, default: null })

const props = defineProps({
    placeholder: { type: String, required: false, default: 'Значення' },
    label: { type: String, required: false, default: (props) => props.placeholder },
    fieldName: { type: String, required: true },
    type: { type: String, default: 'text' },
    important: { type: Boolean, default: false }
})

</script>

<template>
    <div class="flex gap-2 items-center justify-items-start justify-start p-2">

        <form @submit.prevent class="flex flex-col items-start justify-center w-full">

            <label :for="props.fieldName" class="text-lg font-gothic">
                {{ props.label }}
                <ImportantField v-if="props.important" />
                :
            </label>

            <input :id="props.fieldName" :type="props.type" v-model="value" :name="props.fieldName"
                :placeholder="props.placeholder"
                class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray" />
        </form>

    </div>
</template>