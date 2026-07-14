<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { PencilIcon } from '@heroicons/vue/24/solid'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import DeleteButton from '../Buttons/DeleteButton.vue';
import { notify } from '/utils/notification';

const field = defineModel('fields', { type: Object, required: true })

const nameInput = ref(null)
const valueInput = ref(null)
const descriptionInput = ref(null)

const inputStyle = 'py-1 px-2 border-2 text-base text-clip font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-dark transition disabled:bg-darkred-dark disabled:text-darkred-light'

const autoResize = () => {
    const el = descriptionInput.value
    if (el) {
        el.style.height = 'auto'
        const maxHeight = 500
        el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
        el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }
}

onMounted(autoResize)

function validate() {
    let validated = true;
    if (field.value.name.length === 0) {
        notify({ message: 'Поле повино мати назву', type: 'error' })
        nameInput.value?.focus()
        validated = false;
    }
    else if (field.value.value.length === 0) {
        notify({ message: 'Поле повино мати значення', type: 'error' })
        valueInput.value?.focus()
        validated = false;
    }
    return validated
}

async function updateField() {
    if (!validate()) return
    await nextTick()
    autoResize()
}

</script>

<template>

    <div
        class='grid justify-center items-center p-2 border-2 rounded-lg border-darkred-light_gray grid-cols-[1fr_44px] gap-4'>

        <form class="flex flex-col font-univers">
            <label :for="`${field.id}-name`">
                Назва:
            </label>

            <input ref="nameInput" type="text" :id="`${field.id}-name`" v-model="field.name"
                :class="inputStyle">

            <label for="`${field.id}-description`">
                Опис:
            </label>

            <textarea ref="descriptionInput" :name="field.name" :id="`${field.id}-description`"
                v-model="field.description"  :class="inputStyle"
                class="md:auto-hide-scroll resize-none h-fit max-h-[256px]"></textarea>

            <label for="`${field.id}-value`">
                Значення:Freado
            </label>

            <input ref="valueInput" :type="typeof field.value" :id="`${field.id}-value`" v-model="field.value"
                :class="inputStyle">
        </form>

        <div class="h-full self-center flex flex-col justify-between py-4 gap-2">

            <div 
                class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                <component class="text-darkred-light"
                     />
            </div>

            <DeleteButton
                class="flex justify-center items-center text-xl w-11 h-11 bg-darkred-red text-darkred-light"
                />
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