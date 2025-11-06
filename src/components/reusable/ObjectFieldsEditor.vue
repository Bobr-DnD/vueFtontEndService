<script setup>
import { ref } from 'vue'
import ApproveButton from './ApproveButton.vue'

const props = defineProps({
    name: { type: String, required: true }
})

let value_field_string = ref(true)

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
    const name = document.getElementById(`${props.name}Name`).value
    let value

    if (!value_field_string.value) value = parseInt(document.getElementById(`${props.name}Value`).value)
    else value = document.getElementById(`${props.name}Value`).value

    console.log({ [name]: value });


    //Object.assign(props.fields, toCustomFieldObjectField({ name, value }))
}

</script>

<template>
    <div class="w-full">
        <form @submit.prevent
            class="flex w-full items-center justify-start space-x-4 p-2 font-univers mb-2  rounded-xl">
            <label :for="props.name + 'Name'" class="mr-2 w-24 text-darkred-dark font-semibold text-lg tracking-wide">
                Назва поля:
            </label>
            <input :id="props.name + 'Name'" type="text" value="Назва поля" class="bg-darkred-gray max-w-32 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
        </form>

        <form @submit.prevent class="flex w-full items-center justify-start space-x-4 p-2 font-univers mb-2 rounded-xl">
            <label :for="props.name + 'Value'" class="mr-2 w-24 text-darkred-dark font-semibold text-lg tracking-wide">
                Значення:
            </label>
            <input v-if="value_field_string" :id="props.name + 'Value'" type="text" value="Значення" class="bg-darkred-gray max-w-32 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
            <input v-if="!value_field_string" :id="props.name + 'Value'" type="number" value="0" class="bg-darkred-gray max-w-32 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
            <button @click="switchTypeField($event)"
                class="p-2 w-20 border-2 rounded-lg border-darkred-dark">Текст</button>
        </form>

        <ApproveButton @click="addField" class="w-32 mx-auto text-2xl" />

    </div>
</template>