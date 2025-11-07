<script setup>
import { ref, watch } from 'vue'
import ApproveButton from './ApproveButton.vue'

const props = defineProps({
    name: { type: String, required: true },
    fields: { type: Object, required: true, default: {} },
    callback: {Type: Function, required: true}
})

let value_field_string = ref(true)
let input_name = ref('')
let input_value = ref('')

watch(() => props.fields, () => {
    input_name.value.value = ''
    input_value.value.value = ''
})

function switchTypeField(event) {
    if (event.target.innerText === 'Текст') {
        event.target.innerText = 'Число'
        value_field_string.value = false
    }
    else {
        event.target.innerText = 'Текст'
        value_field_string.value = true
    }
}

function addField() {
    props.callback(input_name.value.value, input_value.value.value)
}

</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <form @submit.prevent class="flex flex-col w-full items-start justify-start p-2 font-univers mb-2  rounded-xl">
            <label :for="props.name + 'Name'" class=" text-darkred-dark font-semibold text-lg tracking-wide">
                Назва поля:
            </label>
            <input :ref="'input_name'" :id="props.name + 'Name'" type="text" placeholder="Назва поля" class="w-full font-gothic text-lg text-darkred-dark text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
        </form>

        <form @submit.prevent class="flex flex-col w-full items-start justify-start p-2 font-univers mb-2 rounded-xl">
            <label :for="props.name + 'Value'" class="mr-2 w-24 text-darkred-dark font-semibold text-lg tracking-wide">
                Значення:
            </label>
            <div class="w-full grid grid-cols-[80%_20%] gap-2">
                <input :ref="'input_value'" v-if="value_field_string" :id="props.name + 'Value'" type="text" placeholder="Значення" class="w-full font-gothic text-lg text-darkred-dark text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
                <input :ref="'input_value'" v-if="!value_field_string" :id="props.name + 'Value'" type="number" placeholder="0" class="w-full font-gothic text-lg text-darkred-dark text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
                <button @click="switchTypeField($event)"
                    class="p-2 w-full border-2 rounded-lg border-darkred-dark font-gothic text-lg">Текст</button>
            </div>

        </form>

        <ApproveButton @click="addField" class="w-32 mx-auto text-2xl" />

    </div>
</template>