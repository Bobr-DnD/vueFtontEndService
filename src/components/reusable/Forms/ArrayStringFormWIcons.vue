<script setup>
import { ref, watch } from 'vue';
import PlusButton from '../Buttons/PlusButton.vue';
import DeleteButton from '../Buttons/DeleteButton.vue';
import IconsDropdown from '../IconsDropdown.vue';

const props = defineProps({
    array: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    setIcon: {
        type: Boolean,
        default: false
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
        ...(props.setIcon && { icon: 'checkBadge' })
    })
    update()
}

function removeItem(id) {
    arrayLocal.value = arrayLocal.value.filter(el => el.id !== id)
    update()
}

function updateIcon(id, iconName) {
    const item = arrayLocal.value.find(el => el.id === id)
    if (item) {
        item.icon = iconName
        update()
    }
    
}

function update(){
    emit('update:array', arrayLocal.value)
}

</script>

<template>
    <div class="grid grid-cols-1 gap-2 font-gothic content-start">

        <h1 class="text-2xl ">{{ props.label }}:</h1>
        <h1 v-if="arrayLocal.length === 0" class="text-xl ">Пусто</h1>

        <div v-for="item in arrayLocal" :key="item.id" class="grid gap-4"
            :class="props.setIcon ? 'grid-cols-[1fr_120px_40px]' : 'grid-cols-[1fr_40px]'">


            <input v-model.lazy="item.name" type="text" placeholder="Назва" @change="update" :id="item.id"
                class="p-1 border-4 text-lg border-darkred-dark rounded-lg text-darkred-dark w-full focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />

            <IconsDropdown v-if="props.setIcon" :icon="item.icon" :field_id="item.id" :callback="updateIcon" />

            <DeleteButton class="bg-darkred-red text-darkred-light" @click="removeItem(item.id)" />

        </div>

        <PlusButton class="w-11 h-11 text-center border-4 border-darkred-dark rounded-lg md:hover:cursor-pointer
           md:hover:bg-darkred-gray relative overflow-hidden group" @click="addItem" />
    </div>
</template>