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

const autoResize = () => {
    const el = areaEl.value
    if (el) {
        el.style.height = 'auto'
        const maxHeight = 500
        el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
        el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }
}

onMounted(autoResize)

watch(() => props.value, async (newValue) => {
    editableValue.value = newValue || ''
    fieldReadonly.value = true
    await nextTick()
    autoResize()
})

const editField = async () => {
    fieldReadonly.value = !fieldReadonly.value
    await nextTick()
    areaEl.value.focus()
}

const saveField = () => {
    fieldReadonly.value = true
    let inputValue;

    inputValue = areaEl.value.value
    props.callback(props.fieldName, inputValue)

}
</script>


<template>
    <div class="grid auto-rows-min gap-2 content-start justify-items-start justify-start p-2" :class="!fieldReadonly ? 'grid-cols-[1fr_44px_44px]' : 'grid-cols-[1fr_44px]'">

        <form @submit.prevent class="flex flex-col items-start justify-center w-full">
            <label :for="props.fieldName" class="text-lg font-gothic">{{ props.name }}:</label>
            <textarea :ref="'areaEl'" :name="props.fieldName" :id="props.fieldName" :value="editableValue" @input="autoResize"
                :disabled="fieldReadonly" class="w-full h-fit max-h-[500px] overflow-y-scroll no-scrollbar resize-none
                p-3 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light
                font-univers text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2
                focus:ring-darkred-red focus:border-darkred-red placeholder:text-darkred-light/60
                md:hover:border-darkred-red/70" placeholder="Введіть текст..."></textarea>
        </form>

        <div class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer"
            @click="editField">
            <PencilIcon class="w-4 h-4 text-darkred-light" />
        </div>

        <div v-if="!fieldReadonly"
            class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer"
            @click="saveField">
            <CheckCircleIcon class="w-7 h-7 text-darkred-light" />
        </div>
    </div>
</template>