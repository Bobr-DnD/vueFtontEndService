<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/solid'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    fieldName: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    callback: { type: Function, required: false }
})

const fieldReadonly = ref(true)
let editableValue = ref(props.value)
const areaEl = ref(null)

onMounted(() => {
  const el = document.getElementById(props.fieldName)
  if (el) {
    el.addEventListener('input', () => {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    })
  }
})

watch(() => props.value, (newValue) => {
    editableValue.value = newValue || ''
    fieldReadonly.value = true
})

const editField = async () => {
    fieldReadonly.value = false
}

const saveField = () => {
    fieldReadonly.value = true
    let inputValue;
    
    inputValue = areaEl.value.value
    props.callback(props.fieldName, inputValue)

}
</script>


<template>
    <div class="grid grid-cols-[1fr_44px_44px] auto-rows-min gap-2 items-center justify-items-start justify-start p-2">
        
        <form @submit.prevent class="flex flex-col items-start justify-center w-full">
            <label :for="props.fieldName" class="text-lg font-gothic">{{ props.name }}:</label>
            <textarea :ref="'areaEl'" :name="props.fieldName" :id="props.fieldName" :value="editableValue" :disabled="fieldReadonly"
                class="w-full h-fit max-h-80 overflow-y-hidden resize-none
                p-3 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light
                font-univers text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2
                focus:ring-darkred-red focus:border-darkred-red placeholder:text-darkred-light/60
                hover:border-darkred-red/70" placeholder="Введіть текст..."></textarea>
        </form>

        <div
            class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl">
            <PencilIcon class="w-4 h-4 text-darkred-light hover:cursor-pointer" @click="editField" />
        </div>

        <div v-if="!fieldReadonly"
            class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl">
            <CheckCircleIcon class="w-7 h-7 hover:cursor-pointer text-darkred-light" @click="saveField" />
        </div>
    </div>
</template>