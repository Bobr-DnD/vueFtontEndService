<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { PencilIcon } from '@heroicons/vue/24/solid'
import { CursorArrowRippleIcon } from '@heroicons/vue/24/solid'
import DeleteButton from '../Buttons/DeleteButton.vue';
import { notify } from '/utils/notification';

const fields = defineModel('fields', { type: Object, required: true })

const nameInput = ref(null)
const valueInput = ref(null)
const descriptionInputs = ref(null)
const openDescriptions = ref({})

const inputStyle = 'py-1 px-2 border-2 text-base text-clip font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-dark transition disabled:bg-darkred-dark disabled:text-darkred-light'

function autoResize(el) {
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = 500
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

function autoResizeAll() {
    const els = descriptionInputs.value
        ; (Array.isArray(els) ? els : [els]).filter(Boolean).forEach(autoResize)
}

onMounted(autoResizeAll)

function validate(field) {
    let validated = true;
    if (field.name.length === 0) {
        notify({ message: 'Поле повино мати назву', type: 'error' })
        nameInput.value?.focus()
        validated = false;
    }
    else if (field.value.length === 0) {
        notify({ message: 'Поле повино мати значення', type: 'error' })
        valueInput.value?.focus()
        validated = false;
    }
    return validated
}

function openDescription(field) {
    openDescriptions.value[field.id] = true
    nextTick(() => {
        const el = document.getElementById(`${field.id}-description`)
        if (!el) return
        el.focus()
        autoResize(el)
    })
}

function closeDescription(field) {
    openDescriptions.value[field.id] = false
    commitField(field)
}

function commitField(field) {
    if (!validate(field)) return
    fields.value = [...fields.value]
}

function removeField(id) {
    fields.value = fields.value.filter(field => field.id !== id)
}

</script>

<template>

    <div v-for="field in fields" :key="field.id"
        class='grid justify-center items-center gap-4 p-2 border-2 rounded-lg border-darkred-light_gray grid-cols-[1fr_44px]'>

        <form class="grid grid-cols-2 gap-2 font-univers">

            <div>
                <label :for="`${field.id}-name`">
                    Назва:
                </label>

                <input ref="nameInput" type="text" :id="`${field.id}-name`" v-model="field.name" @blur="commitField(field)"
                    :class="inputStyle">

                <label for="`${field.id}-description`">
                    Опис:
                </label>
            </div>

            <div>
                <label for="`${field.id}-value`">
                    Значення:
                </label>

                <input ref="valueInput" :type="typeof field.value" :id="`${field.id}-value`" v-model="field.value"
                    @blur="commitField(field)" :class="inputStyle">
            </div>

            <div v-if="!openDescriptions[field.id]" @click="openDescription(field)"
                class="col-span-full flex items-center gap-2 py-1 px-2 border-2 rounded-lg border-darkred-light_gray text-darkred-dark cursor-pointer">
                <CursorArrowRippleIcon class="w-5 h-5 shrink-0" />
                <span class="truncate">{{ field.description || 'Опис' }}</span>
            </div>

            <textarea v-else ref="descriptionInputs" :name="field.name" :id="`${field.id}-description`"
                v-model="field.description" @input="autoResize($event.target)" @blur="closeDescription(field)"
                :class="inputStyle" class="md:auto-hide-scroll resize-none h-fit max-h-[256px] col-span-full"></textarea>

        </form>

        <div class="h-full self-center flex items-center py-4 gap-2">

            <DeleteButton @click="removeField(field.id)"
                class="flex justify-center items-center text-xl w-11 h-11 bg-darkred-red text-darkred-light" />
        </div>
    </div>

</template>

<style scoped>
label {
    padding: 0 2px;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0.025em;
}
</style>