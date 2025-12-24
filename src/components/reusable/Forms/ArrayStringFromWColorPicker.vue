<script setup>
import { ref, toRaw } from 'vue';
import AprroveButtonWithText from '../Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../Buttons/RejectButtonWithText.vue';
import PlusButton from '../Buttons/PlusButton.vue';
import DeleteButton from '../Buttons/DeleteButton.vue';

const props = defineProps({
    array: {
        type: Array,
        required: true
    },
    array_name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const arrayLocal = ref()
const inputRefs = ref({})

const originalArray = structuredClone(toRaw(props.array))

arrayLocal.value = props.array.map(el => {
    return {
        id: el.id,
        name: el.name,
        color: el.color
    }
})

function addItem() {
    arrayLocal.value.push({
        id: Math.random().toString(24).slice(2),
        name: '',
        color: ''
    })
}

function removeItem(id) {
    const index = arrayLocal.value.findIndex(el => el.id === id)
    if (index !== -1) arrayLocal.value.splice(index, 1)
}

function updateItem(id) {
    arrayLocal.value.forEach(el => {
        if (el.id === id) el.name = inputRefs.value[id].value
    })
}

function updateArray() {
    props.callback(props.array_name, arrayLocal.value)
}

function discardChanges() {
    arrayLocal.value = structuredClone(originalArray)
}

function updateColor(id, color) {
    arrayLocal.value.forEach(el => {
        if (el.id === id) el.color = color
    })

}

</script>

<template>
    <div>

        <section class="grid grid-cols-1 gap-2 font-gothic">

            <h1 class="text-2xl ">{{ props.label }}:</h1>
            <h1 v-if="arrayLocal.length === 0" class="text-xl ">Пусто</h1>

            <div v-for="item in arrayLocal" :key="item.id" class="grid gap-4 grid-cols-[1fr_40px_40px]">

                <input :ref="el => inputRefs[item.id] = el" :id="item.id" type="text" :value="item.name"
                    placeholder="Назва" @input="updateItem(item.id)"
                    class="p-1 border-4 text-lg border-darkred-dark rounded-lg text-darkred-dark w-full focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />

                <input type="color" :value="item.color ?? '#3BFF00'" @change="updateColor(item.id, $event.target.value)"
                    class="w-full h-full p-0">

                <DeleteButton class="bg-darkred-red text-darkred-light" @click="removeItem(item.id)" />

            </div>

            <div class="flex gap-2">

                <PlusButton class="w-11 h-full text-center border-4 border-darkred-dark rounded-lg md:hover:cursor-pointer
           md:hover:bg-darkred-gray relative overflow-hidden group" @click="addItem" />

                <AprroveButtonWithText text="Зберегти" @click="updateArray"
                    class="p-2 flex justify-center text-lg items-center self-end" />

                <RejectButtonWithText text="Відхилити" @click="discardChanges"
                    class="p-2 flex justify-center text-lg items-center self-end" />
            </div>


        </section>

    </div>
</template>