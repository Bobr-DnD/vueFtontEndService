<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow } from '/utils/entityHelper'
import DeleteButton from '../reusable/Buttons/DeleteButton.vue'
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue'

const props = defineProps({
    inventory_all: {
        type: Array,
        required: true
    },
    inventory: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const groupedInventories = computed(() => groupById(props.inventory))
let block_hidden = ref(true)
let inventory_selected = ref({})

function showDetails(id) {
    inventory_selected.value = props.inventory.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}

function removeItem(id) {
    removeRow(props.inventory, id)
    props.callback(props.inventory)
}

function addItem(event) {
    const id = event.target.value
    addRow(props.inventory_all, props.inventory, id)
    props.callback(props.inventory)

    event.target.value = 'default'
}
</script>

<template>
    <div v-for="inv, index in groupedInventories"
        class="grid grid-cols-[20px_1fr_1fr_30px] p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 md:hover:cursor-pointer"
        :id="'Inventory' + `${index + 1}`" @click="showDetails(inv.id)">

        <div class="text-darkred-light">×{{ inv.count }}</div>

        <div class="p2 text-clip">{{ inv.name }}</div>

        <div class="p2 text-clip">Ціна: {{ inv.price }}</div>

        <DeleteButton :disabled="false"
            :class="false ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
            @click.stop="removeItem(inv.id)" class="w-full" />

    </div>

    <select name="Inventory" id="Inventory" @change="addItem($event)" :class="['w-full h-12 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'md:hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть річ</option>

        <option v-for="inv in props.inventory_all" :value="inv.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ inv.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        @click="block_hidden = true">
        <div
            class="w-80 p-5 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <CloseButtonRedBG @click="block_hidden = true" />

            <div class="font-bold text-2xl text-center border-b border-darkred-red pb-2">
                {{ inventory_selected.name }}
            </div>

            <div v-if="inventory_selected.description"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Опис: <span
                    class="font-medium">{{ inventory_selected.description }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Ціна: <span
                    class="font-medium">{{ inventory_selected.price }}</span></div>

        </div>
    </div>
</template>