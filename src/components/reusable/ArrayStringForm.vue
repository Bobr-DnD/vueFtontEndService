<script setup>
import { ref, toRaw } from 'vue';
import { iconsList } from '@utils/icons';
import AprroveButtonWithText from './Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from './Buttons/RejectButtonWithText.vue';
import PlusButton from './Buttons/PlusButton.vue';
import DeleteButton from './Buttons/DeleteButton.vue';
import IconsDropdown from './IconsDropdown.vue';
import Header1 from './Titles/Header1.vue';

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
    },
    set_icon: {
        type: Boolean,
        default: false
    }
})

const arrayLocal = ref()
const inputRefs = ref({})

const originalArray = structuredClone(toRaw(props.array))

arrayLocal.value = props.array.map(el => {
    return {
        id: el.id,
        name: el.name,
        icon: el.icon
    }
})

function addItem() {
    if (props.set_icon)
        arrayLocal.value.push({
            id: Math.random().toString(24).slice(2),
            name: '',
            icon: iconsList[0].id
        })
    else
        arrayLocal.value.push({
            id: Math.random().toString(24).slice(2),
            name: ''
        })
}

function removeItem(id) {
    const index = arrayLocal.value.findIndex(el => el.id === id)
    if (index !== -1) arrayLocal.value.splice(index, 1)

    console.log(`${arrayLocal.value.length}   ${originalArray.length}`);

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

function updateIcon(id, iconName) {
    arrayLocal.value.forEach(el => {
        if (el.id === id) el.icon = iconName
    })
}

</script>

<template>
    <div>

        <section class="grid grid-cols-1 gap-2 font-gothic">

            <h1 class="text-2xl ">{{ props.label }}:</h1>
            <h1 v-if="arrayLocal.length === 0" class="text-xl ">Пусто</h1>

            <div v-for="item in arrayLocal" :key="item.id" class="grid gap-4"
                :class="props.set_icon ? 'grid-cols-[1fr_120px_40px]' : 'grid-cols-[1fr_40px]'">
                <input :ref="el => inputRefs[item.id] = el" :id="item.id" type="text" :value="item.name"
                    placeholder="Назва" @input="updateItem(item.id)"
                    class="p-1 border-4 text-lg border-darkred-dark rounded-lg text-darkred-dark w-full focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />

                <IconsDropdown v-if="props.set_icon" :icon="item.icon" :field_id="item.id" :callback="updateIcon" />

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