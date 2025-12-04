<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow } from '/utils/entityHelper'
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue'
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue'
import SearchArrayByNameWithAddFunctionality from '../reusable/SearchArrayByNameWithAddFunctionality.vue'
import CloseRedButtonNoBG from '../reusable/Buttons/CloseButtonGrayNoBG.vue'
import SearchArrayByNameViewFunctionality from '../reusable/SearchArrayByNameViewFunctionality.vue'

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
const block_hidden = ref(true)
const inventory_selected = ref({})
const modal_hidden = ref(true)

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

function addItem(inv) {
    addRow(props.inventory_all, props.inventory, inv.id)
    props.callback(props.inventory)
}
</script>

<template>

    <SearchArrayByNameViewFunctionality :array="groupedInventories" label="по інвентарю" type="inventory"
        :callback="removeItem" :callbackModal="showDetails" ƒ/>

    <ModalOpenButton @click="modal_hidden = !modal_hidden" class="justify-self-center" text="Додати щось в інвентар" />

    <div v-if="!modal_hidden" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-[90%] max-w-lg bg-darkred-dark_gray border border-darkred-dark rounded-2xl shadow-xl p-6
            font-univers transition-all duration-300
           sm:w-[80%] md:w-[60%] lg:w-[40%]">

            <CloseRedButtonNoBG @click="modal_hidden = true" />

            <h2 class="text-xl font-gothic text-center mb-4 border-b text-darkred-light border-darkred-dark pb-2">
                Вибір речей
            </h2>

            <SearchArrayByNameWithAddFunctionality :array="props.inventory_all" label="по інвентарю" type="inventory"
                :callback="addItem" />
        </div>
    </div>

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