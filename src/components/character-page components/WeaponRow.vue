<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow } from '/utils/entityHelper'
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue'
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue'
import SearchArrayByNameWithAddFunctionality from '../reusable/SearchArrayByNameWithAddFunctionality.vue'
import CloseRedButtonNoBG from '../reusable/Buttons/CloseButtonGrayNoBG.vue'
import SearchArrayByNameViewFunctionality from '../reusable/SearchArrayByNameViewFunctionality.vue'

const props = defineProps({
    weapons_all: {
        type: Array,
        required: true
    },
    weapons: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const groupedWeapons = computed(() => groupById(props.weapons))
const block_hidden = ref(true)
const modal_hidden = ref(true)
const weapon_selected = ref({})

function showDetails(id) {
    weapon_selected.value = props.weapons.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}

function removeItem(id) {
    removeRow(props.weapons, id)
    props.callback(props.weapons)
}

function addItem(weapon) {
    addRow(props.weapons_all, props.weapons, weapon.id)
    props.callback(props.weapons)
}
</script>

<template>
   
    <SearchArrayByNameViewFunctionality :array="groupedWeapons" label="зброї" type="weapon" :callback="removeItem" :callbackModal="showDetails"/>

    <ModalOpenButton @click="modal_hidden = !modal_hidden" class="justify-self-center" text="Додати зброю" />

    <div v-if="!modal_hidden" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-[90%] max-w-lg bg-darkred-dark_gray border border-darkred-dark rounded-2xl shadow-xl p-6
            font-univers transition-all duration-300
           sm:w-[80%] md:w-[60%] lg:w-[40%]">

            <CloseRedButtonNoBG @click="modal_hidden = true" />

            <h2 class="text-xl font-gothic text-center mb-4 border-b text-darkred-light border-darkred-dark pb-2">
                Вибір зброї
            </h2>

            <SearchArrayByNameWithAddFunctionality :array="props.weapons_all" label="зброї" type="weapon"
                :callback="addItem" />
        </div>
    </div>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        @click="block_hidden = true">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <CloseButtonRedBG @click="block_hidden = true" />

            <div class="col-span-2 font-bold text-2xl text-center border-b border-darkred-red pb-2"
                :class="weapon_selected.legendary ? 'text-orange-gold' : 'text-darkred-light'">
                {{ weapon_selected.name }}
            </div>

            <div class="col-span-2 space-y-1 border-t-4 border-b-4 border-darkred-red rounded-xl py-2 px-1">
                <h3 class="text-center text-lg font-semibold p-1 border-2 border-darkred-dark rounded-xl">Урон:</h3>
                <div v-if="weapon_selected.damage.length > 0" v-for="d in weapon_selected.damage"
                    class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                    <span>{{ d.type }}: {{ d.damage }}</span class="font-medium">
                </div>
                <div v-else class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Урон
                    відсутній</div>
            </div>



            <div v-if="weapon_selected.range.min !== null"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Дальність: <span
                    class="font-medium">{{ weapon_selected.range.min }}-{{ weapon_selected.range.max }}</span></div>

            <div v-else class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Дальність: <span
                    class="font-medium">{{ weapon_selected.range.max }}</span></div>

            <div v-if="weapon_selected.actionPoints.min !== null"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Очки дії: {{
                    weapon_selected.actionPoints.min }}-{{ weapon_selected.actionPoints.max }}</div>

            <div v-else class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Очки дії:
                {{ weapon_selected.actionPoints.max }}</div>

            <div v-if="weapon_selected.requirement"
                class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Вимога: <span
                    class="font-medium">{{Object.entries(weapon_selected.requirement).map(([key, value]) =>
                        `${key}:${value}`).join(', ')}}</span></div>

            <div v-if="weapon_selected.effect"
                class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                Ефект: <span class="font-medium">{{ weapon_selected.effect }}</span></div>

            <div v-if="weapon_selected.type" class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                Тип: <span class="font-medium">{{ weapon_selected.type }}</span></div>

            <div v-if="weapon_selected.specific"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Специфікація: <span
                    class="font-medium">{{ weapon_selected.specific }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Ціна: <span
                    class="font-medium">{{ weapon_selected.price }}</span></div>

            <div v-if="weapon_selected.legendary"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center text-orange-gold">Легендарна
            </div>
        </div>
    </div>

</template>