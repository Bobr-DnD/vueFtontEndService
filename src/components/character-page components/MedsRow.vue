<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow, useItem } from '/utils/entityHelper'
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue'
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue'
import SearchArrayByNameWithAddFunctionality from '../reusable/SearchArrayByNameWithAddFunctionality.vue'
import CloseRedButtonNoBG from '../reusable/Buttons/CloseButtonGrayNoBG.vue'
import MedsTable from './EntityTables/MedsTable.vue'

const props = defineProps({
    medicines_all: {
        type: Array,
        required: true
    },
    medicines: {
        type: Array,
        required: true
    },
    effects_all: {
        type: Array,
        requied: true
    },
    effects: {
        type: [Array, null],
        required: true
    },
    move: {
        type: Number,
        required: true
    },
    callback: {
        type: Function,
        requied: true
    }
})

const groupedMedicines = computed(() => groupById(props.medicines))
const block_hidden = ref(true)
const medicine_selected = ref({})
const modal_hidden = ref(true)

function showDetails(id) {
    medicine_selected.value = props.medicines.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}

function removeItem(id) {
    removeRow(props.medicines, id)
    props.callback(props.medicines)
}

function addItem(medicine) {
    addRow(props.medicines_all, props.medicines, medicine.id)
    props.callback(props.medicines)
}
// TODO refactor later for good | wrong saving effects | should work via websockets
function useMed(medId, effectId) {
    useItem(props.medicines, props.effects_all, props.effects, props.move, medId, effectId)
    props.callback(props.medicines)
}
</script>

<template>

    <div v-for="med, index in groupedMedicines"
        class="grid p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 md:hover:cursor-pointer"
        :id="'Medicine' + `${index + 1}`" @click="showDetails(med.id)" :class="med.effect ? 'grid-cols-[20px_1fr_1fr_30px_30px]' : 'grid-cols-[20px_1fr_1fr_30px]'">

        <MedsTable :med="med" :callbackDelete="removeItem" :callbackUse="useMed" />

    </div>

    <ModalOpenButton @click="modal_hidden = !modal_hidden" class="justify-self-center" text="Додати хілку" />

    <div v-if="!modal_hidden" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-[90%] max-w-lg bg-darkred-dark_gray border border-darkred-dark rounded-2xl shadow-xl p-6
            font-univers transition-all duration-300
           sm:w-[80%] md:w-[60%] lg:w-[40%]">

            <CloseRedButtonNoBG @click="modal_hidden = true" />

            <h2 class="text-xl font-gothic text-center mb-4 border-b text-darkred-light border-darkred-dark pb-2">
                Вибір хілок
            </h2>

            <SearchArrayByNameWithAddFunctionality :array="props.medicines_all" label="хілок" type="medicine"
                :callback="addItem" />
        </div>
    </div>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        @click="block_hidden = true">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <CloseButtonRedBG @click="block_hidden = true" />

            <div class="col-span-2 font-bold text-2xl text-center border-b border-darkred-red pb-2">
                {{ medicine_selected.name }}
            </div>

            <div class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                <span class="font-medium">{{ medicine_selected.description }}</span>
            </div>

            <div class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Ціна:
                <span class="font-medium">{{ medicine_selected.price }}</span>
            </div>

            <div v-if="medicine_selected.effect" class="col-span-2 grid grid-cols-1 gap-2 space-y-2">
                <div class="font-bold text-xl text-center border-b border-darkred-red pb-2">
                    Позитивний еффект
                </div>

                <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Назва: <span
                        class="font-medium">{{ medicine_selected.effect.name }}</span></div>

                <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Еффект: <span
                        class="font-medium">{{ medicine_selected.effect.description }}</span></div>
            </div>

            <div v-if="medicine_selected.effect" class="col-span-2 grid grid-cols-1 gap-2 space-y-2">
                <div class="font-bold text-xl text-center border-b border-darkred-red pb-2">
                    Негативний еффект
                </div>

                <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Назва: <span
                        class="font-medium">{{ medicine_selected.addictionEffect.name }}</span></div>

                <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Еффект: <span
                        class="font-medium">{{ medicine_selected.addictionEffect.description }}</span></div>

                <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Умова: <span
                        class="font-medium">{{ medicine_selected.addictionCondition }}</span></div>
            </div>

            <div v-if="medicine_selected.recipe" class="col-span-2 grid grid-cols-1 gap-2 space-y-2">
                <div class="font-bold text-xl text-center border-b border-darkred-red pb-2">
                    Рецепт:
                </div>

                <div v-for="r, i in medicine_selected.recipe"
                    class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                    {{ i + 1 }}. <span class="font-medium">{{ r.name }}</span>
                </div>
            </div>

        </div>
    </div>

</template>