<script setup>
import { ref, toRaw, watch, onMounted } from 'vue';
import AprroveButtonWithText from '../Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../Buttons/RejectButtonWithText.vue';
import PlusButton from '../Buttons/PlusButton.vue';
import DeleteButton from '../Buttons/DeleteButton.vue';
import { notify } from '@utils/notification';
import UnsavedLabel from '../UnsavedLabel.vue';

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
        default: null
    },
    callback: {
        type: Function,
        required: true
    }
})

const arrayLocal = ref()
const inputRefs = ref({})
const unsavedChanges = ref(false)

let originalArray = structuredClone(toRaw(props.array))

arrayLocal.value = props.array.map(el => {
    return {
        id: Math.random().toString(24).slice(2),
        text: el,
    }
})

watch(() => props.array, () => {

    originalArray = structuredClone(toRaw(props.array))

    arrayLocal.value = props.array.map(el => {
        return {
            id: Math.random().toString(24).slice(2),
            text: el,
        }
    })
})

function markUnsaved(){
    unsavedChanges.value = true
}

function addItem() {
    arrayLocal.value.push({
        id: Math.random().toString(24).slice(2),
        text: ''
    })
    markUnsaved()
}

function removeItem(id) {
    const index = arrayLocal.value.findIndex(el => el.id === id)
    if (index !== -1) arrayLocal.value.splice(index, 1)
    markUnsaved()
}

function updateItem(id) {
    arrayLocal.value.forEach(el => {
        if (el.id === id) el.text = inputRefs.value[id].value
    })
    markUnsaved()
}

function updateArray() {
    let save = false
    for (const el of arrayLocal.value) {
        if (!el.text) {
            notify({ message: 'Введіть текст у поля опису перку', type: 'error' })
            save = false
            break
        }
        save = true
    }

    if (save) {
        const descriptions = arrayLocal.value.map(el => el.text)
        props.callback(props.array_name, descriptions)
        unsavedChanges.value = false
    }

}

function discardChanges() {
    arrayLocal.value = originalArray.map(el => {
        return {
            id: Math.random().toString(24).slice(2),
            text: el,
        }
    })
    unsavedChanges.value = false
}

</script>

<template>
    <div>

        <section class="grid grid-cols-1 gap-2 font-gothic">

            <h1 v-if="props.label" class="text-2xl ">{{ props.label }}:</h1>
            <h1 v-if="arrayLocal.length === 0" class="text-xl ">Пусто</h1>

            <div v-for="item, index in arrayLocal" :key="item.id" class="grid grid-cols-[1fr_40px] gap-4">
                <input :ref="el => inputRefs[item.id] = el" :id="item.id" type="text" :value="item.text"
                    placeholder="Назва" @input="updateItem(item.id)"
                    class="p-1 border-4 text-lg border-darkred-dark rounded-lg text-darkred-dark w-full focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />

                <DeleteButton class="bg-darkred-red text-darkred-light" @click="removeItem(item.id)" />

            </div>

            <div class="flex gap-2">

                <PlusButton class="w-11 h-full text-center border-4 border-darkred-dark rounded-lg md:hover:cursor-pointer
           md:hover:bg-darkred-gray relative overflow-hidden group" @click="addItem" />

                <AprroveButtonWithText text="Зберегти" @click="updateArray"
                    class="p-2 flex justify-center text-lg items-center self-end" />

                <RejectButtonWithText text="Відхилити" @click="discardChanges"
                    class="p-2 flex justify-center text-lg items-center self-end" />

                <UnsavedLabel v-if="unsavedChanges"/>
            </div>


        </section>

    </div>
</template>