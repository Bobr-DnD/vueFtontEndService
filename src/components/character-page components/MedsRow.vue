<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow, useItem } from '/utils/entityHelper'
import DeleteButton from '../reusable/Buttons/DeleteButton.vue'
import ApproveButton from '../reusable/Buttons/ApproveButton.vue'

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
let block_hidden = ref(true)
let medicine_selected = ref({})

function showDetails(id) {
    medicine_selected.value = props.medicines.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}

function removeItem(id){
    removeRow(props.medicines, id)
    props.callback(props.medicines)
}

function addItem(event) {
    const id = event.target.value
    addRow(props.medicines_all, props.medicines, id)
    props.callback(props.medicines)

    event.target.value = 'default'
}
// TODO refactor later for good | wrong saving effects | should work via websockets
function useMed(medId, effectId) {
    useItem(props.medicines, props.effects_all, props.effects, props.move, medId, effectId)
    props.callback(props.medicines)
}
</script>

<template>

    <div v-for="med, index in groupedMedicines"
        class="grid grid-cols-[20px_1fr_1fr_30px_30px] p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 md:hover:cursor-pointer"
        :id="'Medicine' + `${index + 1}`" @click="showDetails(med.id)">

        <div class="text-darkred-light">×{{ med.count }}</div>

        <div class="p2 text-clip">{{ med.name }}</div>

        <div class="p2 text-clip">{{ med.description }}</div>

        <ApproveButton @click.stop="useMed(med.id, med.effect.id)" class="w-full"/>
        <DeleteButton @click.stop="removeItem(med.id)" class="w-full"/>

    </div>

    <select name="Medicines" id="Medicines" @change="addItem($event)" :class="['w-full h-12 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'md:hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть медикамент</option>

        <option v-for="med in props.medicines_all" :value="med.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ med.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click="block_hidden = true">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <div @click="block_hidden = true"
                class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer md:hover:bg-darkred-bright transition select-none">
                ✕
            </div>

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