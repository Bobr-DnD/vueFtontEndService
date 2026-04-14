<script setup>
import { ref, watch } from 'vue';
import PlusButton from '../Buttons/PlusButton.vue';
import DeleteButton from '../Buttons/DeleteButton.vue';

const props = defineProps({
    array: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:array'])

const arrayLocal = ref()

watch(
    () => props.array,
    (val) => {
        arrayLocal.value = val.map(el => ({ ...el }))
    },
    { immediate: true, deep: true }
)

function addItem() {
    arrayLocal.value.push({
        id: crypto.randomUUID(),
        name: '',
        color: ''
    })
    update()
}

function removeItem(id) {
    arrayLocal.value = arrayLocal.value.filter(el => el.id !== id)
    update()
}

function update() {
    emit('update:array', arrayLocal.value)
}

function updateColor(id, color) {
    arrayLocal.value.forEach(el => {
        if (el.id === id) el.color = color
    })
    update()
}

</script>

<template>
    <div class="grid grid-cols-1 gap-2 font-gothic content-start">

        <h1 class="text-2xl ">{{ props.label }}:</h1>
        <h1 v-if="arrayLocal.length === 0" class="text-xl ">Пусто</h1>

        <div v-for="item in arrayLocal" :key="item.id" class="grid gap-4 grid-cols-[1fr_40px_40px]">

            <input v-model.lazy="item.name" type="text" placeholder="Назва" @change="update" :id="item.id"
                class="p-1 border-4 text-lg border-darkred-dark rounded-lg text-darkred-dark w-full focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />

            <input type="color" :value="item.color || '#3BFF00'" @change="updateColor(item.id, $event.target.value)" :id="`${item.id}-color`"
                class="w-full h-full p-0">

            <DeleteButton class="bg-darkred-red text-darkred-light" @click="removeItem(item.id)" />

        </div>

        <PlusButton class="w-11 h-11 text-center border-4 border-darkred-dark rounded-lg md:hover:cursor-pointer
           md:hover:bg-darkred-gray relative overflow-hidden group" @click="addItem" />
    </div>
</template>