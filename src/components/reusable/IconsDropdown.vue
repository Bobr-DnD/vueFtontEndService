<script setup>
import { ref } from 'vue'
import { iconsList } from 'utils/icons'

const props = defineProps({
    icon: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)

function selectOption(option) {
    emit('update:modelValue', option.value)
    open.value = false
}
</script>
<!-- TODO rewrite this piece of shit -->
<template>
    <div class="relative w-full">
        <!-- Selected -->
        <button @click="open = !open" class="w-full flex items-center gap-2 px-3 py-2 border border-darkred-dark rounded-md
             bg-darkred-dark_gray text-darkred-light hover:bg-darkred-dark transition">

            <component v-if="props.options.find(o => o.value === props.modelValue)?.icon"
                :is="props.options.find(o => o.value === props.modelValue).icon" class="w-5 h-5" />

            <span>
                {{props.options.find(o => o.value === props.modelValue)?.label || "Select..."}}
            </span>

        </button>

        <!-- Dropdown -->
        <div v-if="open" class="absolute mt-1 w-full rounded-md bg-darkred-dark_gray border border-darkred-dark
             shadow-lg z-50 flex flex-col py-1">

            <button v-for="option in props.options" :key="option.value" @click="selectOption(option)" class="flex items-center gap-2 px-3 py-2 text-left hover:bg-darkred-light_gray
               text-darkred-light transition">

                <component :is="option.icon" class="w-5 h-5" />

            </button>
        </div>
    </div>
</template>
