<script setup>
import { ref, nextTick, watch } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/solid'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import ImportantField from './ImportantField.vue'

const props = defineProps({
    placeholder: { type: String, required: true },
    fieldName: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    callback: { type: Function, required: true },
    type: { type: String, default: 'text' },
    important: { type: Boolean, default: false }
})

const fieldReadonly = ref(true)
let editableValue = ref(props.value)
const inputEl = ref(null)

watch(() => props.value, (newValue) => {
    editableValue.value = newValue
    fieldReadonly.value = true
})

const editField = async () => {
    fieldReadonly.value = false
    await nextTick()
    inputEl.value?.focus()
}

const saveField = () => {
    fieldReadonly.value = true
    let inputValue;
    if (props.type === 'text') inputValue = inputEl.value.value
    else inputValue = parseInt(inputEl.value.value) || 0
    props.callback(props.fieldName, inputValue)

}
</script>

<template>
    <div class="grid grid-cols-[1fr_44px] gap-2 items-center justify-items-start justify-start p-2">

        <form @submit.prevent class="flex flex-col items-start justify-center w-full">
            
            <label :for="props.fieldName" class="text-lg font-gothic">
                {{ props.placeholder }}
                    <ImportantField v-if="props.important"/>
                :
            </label>

            <input ref="inputEl" :id="props.fieldName" :type="props.type" :value="editableValue"
                :disabled="fieldReadonly" :name="props.fieldName" :placeholder="props.placeholder"
                class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full
               disabled:bg-darkred-dark_gray disabled:text-darkred-light placeholder-darkred-dark_gray/60 disabled:placeholder-darkred-light/60 transition-all duration-200" />
        </form>

        <div v-if="fieldReadonly" @click="editField"
            class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
            <PencilIcon class="w-4 h-4 text-darkred-light md:hover:cursor-pointer" />
        </div>

        <div v-if="!fieldReadonly" @click="saveField"
            class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
            <CheckCircleIcon class="w-7 h-7 md:hover:cursor-pointer text-darkred-light" />
        </div>

    </div>
</template>