<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { PencilSquareIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

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
    editableValue.value = newValue
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
    <div class="grid grid-cols-[1fr_40px_40px] items-center justify-items-start justify-start p-2 space-x-2">
        <form @submit.prevent class="flex flex-col items-start justify-center w-full">
            <label :for="props.fieldName" class="text-lg font-gothic">{{ props.name }}:</label>
            <textarea :ref="'areaEl'" :name="props.fieldName" :id="props.fieldName" :value="editableValue" :disabled="fieldReadonly"
                class="w-full min-h-24 max-h-80 overflow-y-hidden resize-none
                p-3 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light
                font-univers text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2
                focus:ring-darkred-red focus:border-darkred-red placeholder:text-darkred-light/60
                hover:border-darkred-red/70" placeholder="Введіть текст..."></textarea>
        </form>

        <PencilSquareIcon class="w-8 h-8 hover:cursor-pointer transition-colors self-start mb-1"
            :class="fieldReadonly ? 'text-darkred-dark hover:text-greenish-mid' : 'text-greenish-mid'"
            @click="editField" />

        <CheckCircleIcon v-if="!fieldReadonly"
            class="w-8 h-8 hover:cursor-pointer text-greenish-mid transition-colors hover:text-greenish-light self-start mb-1"
            @click="saveField" />
    </div>
</template>