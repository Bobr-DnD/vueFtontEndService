<script setup>
import { ref, nextTick, computed } from 'vue'
import deleteButton from '../reusable/DeleteButton.vue'
import groupById from '/utils/itemStacker'

const inventory = defineModel('inventory', { type: Array, required: true })
const props = defineProps({
    inventory_all: {
        type: Array,
        required: true
    }
})

let block_hidden = ref(true)
let inventory_selected = ref({})

function showDetails(id) {
    inventory_selected.value = props.inventory_all.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}
function deleteRow(index) {
    inventory.value.splice(index, 1)
}
function addRow() {
    const inventory_one = props.inventory_all.find(w => w.id === event.target.value)
    inventory.value.push(inventory_one)
    event.target.value = 'default'
}
</script>

<template>
    <div v-for="inv, index in inventory"
        class="grid grid-cols-[65%_1fr_30px] p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 hover:cursor-pointer"
        :id="'Inventory' + `${index + 1}`" @click="showDetails(inv.id)">

        <div class="p2 text-clip">{{ inv.name }}</div>
        <div class="p2 text-clip">Ціна: {{ inv.price }}</div>

        <div @click.stop="deleteRow(index)"
            class=" p-2 w-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer select-none">
            X</div>

    </div>

    <select name="Inventory" id="Inventory" @change="addRow" :class="['w-full h-12 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть річ</option>

        <option v-for="inv in props.inventory_all" :value="inv.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ inv.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div
            class="w-80 p-5 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <!--<div @click="block_hidden = true"
                class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer hover:bg-darkred-bright transition select-none">
                ✕
            </div>-->
            <deleteButton />

            <div class="font-bold text-2xl text-center border-b border-darkred-red pb-2">
                {{ inventory_selected.name }}
            </div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Опис: <span
                    class="font-medium">{{ inventory_selected.description }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Ціна: <span
                    class="font-medium">{{ inventory_selected.price }}</span></div>

        </div>
    </div>
</template>