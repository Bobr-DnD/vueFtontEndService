<script setup>
import { ref, onMounted } from 'vue'

const modelValue = defineModel('value', { type: String, required: true })

const props = defineProps({
    label: { type: String, required: true }
})

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
</script>


<template>
    <div class="p-2">

        <form @submit.prevent class="flex flex-col items-start justify-center w-full">
            <label :for="props.label" class="text-lg font-gothic">{{ props.label }}:</label>
            <textarea ref="areaEl" :name="props.label" :id="props.label" v-model="modelValue" @input="autoResize"
                class="w-full h-fit max-h-[500px] overflow-y-auto md:auto-hide-scroll resize-none
                p-1 border-4 text-lg font-gothic border-darkred-light_gray rounded-lg text-darkred-dark focus:border-darkred-dark" placeholder="Введіть текст..."></textarea>
        </form>
    </div>
</template>