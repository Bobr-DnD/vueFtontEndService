<script setup>

const weapons = defineModel('weapons', { type: Array, required: true })
const props = defineProps({
    weapons_all: {
        type: Array,
        required: true
    }
})

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
    <div v-for="weapon, index in weapons" class="grid grid-cols-[1fr_1fr_1fr_1fr_30px] grid-rows-2 p-2 gap-2 items-center justify-items-center 
            bg-darkred-gray border-2 border-darkred-red rounded-lg text-darkred-dark text-sm font-medium my-2"
        :id="'Weapon' + `${index + 1}`">
        <div class="col-span-4 p2 text-clip ">{{ weapon.name }}</div>
        <div @click="deleteRow(index)"
            class="row-span-2 p-2 text-clip w-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer">
            X</div>
        <div class="col-span-2 p2 text-clip ">Урон: {{ weapon.damage }}</div>
        <div class="p2 text-clip ">Очки дії: {{ weapon.actionPoints }}</div>
        <div class="p2 text-clip ">Вимоги: {{Object.entries(weapon.requirement).map(([key, value]) =>
            `${key}:${value}`).join(',')}}</div>
    </div>
    <select name="Weapons" id="Weapons" @change="addRow" :class=" ['min-w-fit max-w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center']">
        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть зброю</option>
        <option v-for="weapon in props.weapons_all" :value="weapon.id" class="bg-darkred-dark text-darkred-bright text-clip">
            {{ weapon.name }} </option>
    </select>
</template>