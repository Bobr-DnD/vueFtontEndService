<script setup>
import { reactive, computed, toRaw, ref } from 'vue'
import ApproveButton from './Buttons/ApproveButton.vue'
import ImportantField from './ImportantField.vue'
import { notify } from '/utils/notification'

const props = defineProps({
    name: { type: String, required: true },
    callback: { type: Function, required: true }
})

const form = reactive({
    name: '',
    description: '',
    value: '',
    isString: true
})

const nameInput = ref(null)
const valueInput = ref(null)

const inputStyle = 'w-full font-gothic text-lg text-darkred-dark text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-darkred-dark transition'
const valueType = computed(() => (form.isString ? 'text' : 'number'))

function switchTypeField(event) {
    form.isString = !form.isString
    form.value = ''
    event.target.innerHTML = form.isString ? 'Текст' : 'Число'
}

function validate() {
    let validated = true;
    if (form.name?.length === 0) {
        notify({ message: 'Поле повино мати назву', type: 'error' })
        nameInput.value?.focus()
        validated = false;
    }
    else if (form.value?.length === 0) {
        notify({ message: 'Поле повино мати значення', type: 'error' })
        valueInput.value?.focus()
        validated = false;
    }
    return validated
}

function reset(){
    form.name = ''
    form.description = ''
    form.value = ''
}

function addField() {

    if (!validate()) return

    const value = form.isString ? toRaw(form.value) : Number(toRaw(form.value))

    props.callback(
        {
            name: toRaw(form.name),
            description: toRaw(form.description) ?? '',
            value: value
        }
    )
    reset()
}

</script>

<template>
    <div class="flex flex-col justify-center items-center">

        <form @submit.prevent="addField"
            class="flex flex-col w-full items-start justify-start p-2 font-univers mb-2  rounded-xl">

            <label :for="`${props.name}-name`" class=" text-darkred-dark_gray font-semibold text-lg tracking-wide">
                Назва поля
                <ImportantField />
                :
            </label>

            <input v-model="form.name" ref="nameInput" :id="`${props.name}-name`" type="text" placeholder="Назва поля"
                :class="inputStyle" />

            <label :for="`${props.name}-description`" class=" text-darkred-dark_gray">
                Опис поля:
            </label>

            <input v-model="form.description" :id="`${props.name}-description`" type="text" placeholder="Опис поля"
                :class="inputStyle" />

            <label :for="`${props.name}-value`" class="text-darkred-dark_gray">
                Значення
                <ImportantField />
                :
            </label>

            <div class="w-full grid grid-cols-[1fr_90px] gap-2">

                <input v-model="form.value" ref="valueInput" :id="`${props.name}-value`" :type="valueType"
                    :placeholder="form.isString ? 'Значення' : 0" :class="inputStyle" />

                <button @click="switchTypeField($event)" type="button"
                    class="p-2 w-full border-2 rounded-lg bg-darkred-light_gray border-darkred-light_gray text-darkred-dark font-gothic text-lg">Текст</button>
            </div>

        </form>

        <ApproveButton @click="addField" class="w-32 mx-auto text-2xl" />
    </div>
</template>

<style scoped>
label {
    font-weight: 600;
    font-size: 1.125rem;
    line-height: 1.75rem;
    letter-spacing: 0.025em;
}
</style>