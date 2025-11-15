<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow } from '/utils/entityHelper'
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue'
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue'
import SearchArrayByNameWithAddFunctionality from '../reusable/SearchArrayByNameWithAddFunctionality.vue'
import CloseRedButtonNoBG from '../reusable/Buttons/CloseButtonGrayNoBG.vue'
import ArmorTable from './EntityTables/ArmorTable.vue'

const props = defineProps({
    armors_all: {
        type: Array,
        required: true
    },
    armors: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const groupedArmors = computed(() => groupById(props.armors))
const armor_selected = ref({})
const block_hidden = ref(true)
const modal_hidden = ref(true)

function showDetails(id) {
    armor_selected.value = props.armors.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}

function removeItem(id) {
    removeRow(props.armors, id)
    props.callback(props.armors)
}

function addItem(armor) {
    addRow(props.armors_all, props.armors, armor.id)
    props.callback(props.armors)
}
</script>

<template>
    <div v-for="armor, index in groupedArmors"
        class="grid grid-cols-[20px_1fr_1fr_1fr_1fr_1fr_30px] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 md:hover:cursor-pointer"
        :id="'Armor' + `${index + 1}`" @click.prevent="showDetails(armor.id)">

        <ArmorTable :armor="armor" :callback="removeItem" />

    </div>

    <ModalOpenButton @click="modal_hidden = !modal_hidden" class="justify-self-center" text="Додати броню" />

    <div v-if="!modal_hidden" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-[90%] max-w-lg bg-darkred-dark_gray border border-darkred-dark rounded-2xl shadow-xl p-6
            font-univers transition-all duration-300
           sm:w-[80%] md:w-[60%] lg:w-[40%]">

            <CloseRedButtonNoBG @click="modal_hidden = true" />

            <h2 class="text-xl font-gothic text-center mb-4 border-b text-darkred-light border-darkred-dark pb-2">
                Вибір броні
            </h2>

            <SearchArrayByNameWithAddFunctionality :array="props.armors_all" label="броні" type="armor"
                :callback="addItem" />
        </div>
    </div>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <CloseButtonRedBG @click="block_hidden = true" />

            <div class="col-span-2 font-bold text-2xl text-center border-b border-darkred-red pb-2">
                {{ armor_selected.name }}
            </div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Тип: <span
                    class="font-medium">{{ armor_selected.type }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Захист: <span
                    class="font-medium">{{ armor_selected.resist }}</span></div>

            <div v-if="armor_selected.requirement"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Вимога: <span
                    class="font-medium">{{Object.entries(armor_selected.requirement).map(([key, value]) =>
                        `${key}:${value}`).join(', ')}}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Ціна: <span
                    class="font-medium">{{ armor_selected.price }}</span></div>

            <div v-if="armor_selected.effect"
                class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                Ефект: <span class="font-medium">{{ armor_selected.effect }}</span></div>
        </div>
    </div>

</template>