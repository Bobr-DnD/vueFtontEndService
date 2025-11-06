<script setup>
import { ref, nextTick, watch } from 'vue'
import { PencilSquareIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    placeholder: { type: String, required: true },
    fieldName: { type: String, required: true },
    value: { type:  [String, Number], default: '' },
    callback: { type: Function, required: true },
    type: {type: String, default: 'text'}
})

const fieldReadonly = ref(true)
let editableValue = ref(props.value)
const inputEl = ref(null)

watch(() => props.value, (newValue) => {
    editableValue.value = newValue
})

const editField = async () => {
    fieldReadonly.value = false
    await nextTick()
    inputEl.value.focus()
}

const saveField = () => {
    fieldReadonly.value = true
    let inputValue;
    if (props.type === 'text') inputValue = inputEl.value.value
    else inputValue = parseInt(inputEl.value.value)
    props.callback(props.fieldName, inputValue)

}
</script>

<template>
    <div class="grid grid-cols-[1fr_40px_40px] items-center justify-items-start justify-start p-2 space-x-2">
        <form @submit.prevent class="flex flex-col items-start justify-center w-full">
            <label :for="props.fieldName" class="text-lg font-gothic">{{ props.placeholder }}:</label>
            <input :ref="'inputEl'" :id="props.fieldName" :type="props.type" :value="editableValue" :disabled="fieldReadonly" :name="props.fieldName"
                :placeholder="props.placeholder" class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full
               disabled:bg-darkred-dark_gray disabled:text-darkred-light/60 transition-all duration-200" />
        </form>

        <PencilSquareIcon class="w-8 h-8 hover:cursor-pointer transition-colors self-end mb-1"
            :class="fieldReadonly ? 'text-darkred-dark hover:text-greenish-mid' : 'text-greenish-mid'"
            @click="editField" />

        <CheckCircleIcon v-if="!fieldReadonly"
            class="w-8 h-8 hover:cursor-pointer text-greenish-mid transition-colors hover:text-greenish-light self-end mb-1"
            @click="saveField" />
    </div>
</template>