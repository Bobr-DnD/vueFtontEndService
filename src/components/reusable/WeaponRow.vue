<script setup>
import { ref } from 'vue'

const weapons = defineModel('weapons', { type: Array, required: true })
const props = defineProps({
    weapons_all: {
        type: Array,
        required: true
    }
})

let block_hidden = ref(true)
let weapon_selected = ref({})

function showDetails(id) {
    weapon_selected.value = props.weapons_all.filter(w => w.id === id)[0]
    block_hidden.value = false
}
function deleteRow(index) {
    weapons.value.splice(index, 1)
}
function addRow() {
    const weapon_one = props.weapons_all.filter(w => w.id === event.target.value)[0]
    weapons.value.push(weapon_one)
    event.target.value = 'default'
}
</script>

<template>
    <div v-for="weapon, index in weapons"
        class="grid grid-cols-[1fr_1fr_1fr_30px] grid-rows-3 p-2 gap-2 items-center justify-items-center 
            bg-darkred-gray border-2 border-darkred-red rounded-lg text-darkred-dark text-sm font-medium my-2 hover:cursor-pointer"
        :id="'Weapon' + `${index + 1}`" @click="showDetails(weapon.id)">

        <div class="col-span-3 p2 text-clip">{{ weapon.name }}</div>

        <div @click.stop="deleteRow(index)"
            class="row-span-3 p-2 w-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer">
            X</div>

        <div class="col-span-2 p2 text-clip">Урон: {{ weapon.damage }}</div>

        <div class="p2 text-clip">Очки дії: {{ weapon.actionPoints }}</div>

        <div v-if="weapon.requirement" class="col-span-3 p2 text-clip">Вимоги:
            {{Object.entries(weapon.requirement).map(([key, value]) =>
                `${key}:${value}`).join(',')}}</div>

        <div v-else class="col-span-3 p2 text-clip">Вимоги відсутні</div>

    </div>

    <select name="Weapons" id="Weapons" @change="addRow" :class="['min-w-fit max-w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть зброю</option>

        <option v-for="weapon in props.weapons_all" :value="weapon.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ weapon.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative">

            <div @click="block_hidden = true"
                class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer hover:bg-darkred-bright transition">
                ✕
            </div>

            <div class="col-span-2 font-bold text-2xl text-center border-b border-darkred-red pb-2"
                :class="weapon_selected.legendary ? 'text-orange-gold' : 'text-darkred-light'">
                {{ weapon_selected.name }}
            </div>

            <div class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Урон: <span>
                </span class="font-medium">{{ weapon_selected.damage }}</div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Дальність: <span
                    class="font-medium">{{ weapon_selected.range }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Очки дії: <span
                    class="font-medium">{{ weapon_selected.actionPoints }}</span></div>

            <div v-if="weapon_selected.requirement"
                class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Вимога: <span
                    class="font-medium">{{Object.entries(weapon_selected.requirement).map(([key, value]) =>
                        `${key}:${value}`).join(', ')}}</span></div>

            <div v-if="weapon_selected.effect"
                class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                Ефект: <span class="font-medium">{{ weapon_selected.effect }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Тип: <span
                    class="font-medium">{{ weapon_selected.type }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Специфікація: <span
                    class="font-medium">{{ weapon_selected.specific }}</span></div>

            <div class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center">Ціна: <span
                    class="font-medium">{{ weapon_selected.price }}</span></div>

            <div v-if="weapon_selected.legendary"
                class="text-md p-1 border-2 border-darkred-dark rounded-xl text-center text-orange-gold">Легендарна
            </div>
        </div>
    </div>

</template>