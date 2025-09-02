<script setup>
import { ref } from 'vue' 

const medicines = defineModel('medicines', { type: Array, required: true })
const props = defineProps({
    medicines_all: {
        type: Array,
        required: true
    }
})

let block_hidden = ref(true)
let medicine_selected = ref({})

function showDetails(id) {
    medicine_selected.value = props.medicines_all.filter(w => w.id === id)[0]
    block_hidden.value = false
}
function deleteRow(index) {
    medicines.value.splice(index, 1)
}
function addRow() {
    const meds_one = props.medicines_all.filter(w => w.id === event.target.value)[0]
    medicines.value.push(meds_one)
    event.target.value = 'default'
}
function useItem(index, effect) {
    medicines.value.splice(index, 1)
    console.log(effect);
    
}
</script>

<template>

    <div v-for="med, index in medicines"
        class="grid grid-cols-[1fr_1fr_30px_30px] p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-gray border-2 border-darkred-red rounded-lg text-darkred-dark text-sm font-medium my-2 hover:cursor-pointer"
        :id="'Medicine' + `${index + 1}`" @click="showDetails(med.id)">

        <div class="p2 text-clip">{{ med.name }}</div>

        <div class="p2 text-clip">{{ med.description }}</div>

        <div @click.stop="useItem(index, med.effect)"
            class="p-2 w-full bg-greenish-dark rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer select-none">
            ✓</div>

        <div @click.stop="deleteRow(index)"
            class="p-2 pw-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer select-none">
            X</div>

    </div>

    <select name="Medicines" id="Medicines" @change="addRow" :class="['min-w-fit w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть медикамент</option>

        <option v-for="med in props.medicines_all" :value="med.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ med.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <div @click="block_hidden = true"
                class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer hover:bg-darkred-bright transition select-none">
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