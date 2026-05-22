<script setup>
import ImportantField from '../ImportantField.vue';

const value = defineModel('inputValue', { type: [String, Number], required: true, default: null })

const props = defineProps({
    placeholder: { type: String, required: true },
    fieldName: { type: String, required: true },
    type: { type: String, default: 'text' },
    important: { type: Boolean, default: false }
})

</script>

<template>
    <div class="flex gap-2 items-center justify-items-start justify-start p-2">

        <form @submit.prevent class="flex flex-col items-start justify-center w-full">

            <label :for="props.fieldName" class="text-lg font-gothic">
                {{ props.placeholder }}
                <ImportantField v-if="props.important" />
                :
            </label>

            <input :id="props.fieldName" :type="props.type" v-model="value" :name="props.fieldName"
                :placeholder="props.placeholder"
                class="p-1 border-4 text-lg font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-dark" />
        </form>

    </div>
</template>