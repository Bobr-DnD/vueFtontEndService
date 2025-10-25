<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow } from '/utils/entityHelper'
import DeleteButton from '../reusable/DeleteButton.vue'

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
let block_hidden = ref(true)
let weapon_selected = ref({})

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

function addItem(event) {
    const id = event.target.value
    addRow(props.weapons_all, props.weapons, id)
    props.callback(props.weapons)

    event.target.value = 'default'
}
</script>

<template>
    <div v-for="weapon, index in groupedWeapons"
        class="grid grid-cols-[20px_1fr_1fr_1fr_30px] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 hover:cursor-pointer"
        :id="'Weapon' + `${index + 1}`" @click="showDetails(weapon.id)">

        <div class="text-darkred-light row-span-3">×{{ weapon.count }}</div>

        <div class="col-span-3 p2 text-clip">
            {{ weapon.name }}

        </div>

        <DeleteButton @click.stop="removeItem(weapon.id)" class="row-span-3 w-full" />

        <div class="col-span-2 p2 text-clip">Урон: {{ weapon.damage[0].damage }}</div>

        <div v-if="weapon.actionPoints.min !== null" class="p2 text-clip">Очки дії: {{
            weapon.actionPoints.min }}-{{ weapon.actionPoints.max }}</div>
        <div v-else class="p2 text-clip">Очки дії: {{ weapon.actionPoints.max }}</div>

        <div v-if="weapon.requirement" class="col-span-3 p2 text-clip">Вимоги:
            {{Object.entries(weapon.requirement).map(([key, value]) =>
                `${key}:${value}`).join(',')}}</div>

        <div v-else class="col-span-3 p2 text-clip">Вимоги відсутні</div>

    </div>

    <select name="Weapons" id="Weapons" @change="addItem($event)" :class="['w-full h-12 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть зброю</option>

        <option v-for="weapon in props.weapons_all" :value="weapon.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ weapon.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        @click="block_hidden = true">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <div @click="block_hidden = true"
                class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer hover:bg-darkred-bright transition select-none">
                ✕
            </div>

            <div class="col-span-2 font-bold text-2xl text-center border-b border-darkred-red pb-2"
                :class="weapon_selected.legendary ? 'text-orange-gold' : 'text-darkred-light'">
                {{ weapon_selected.name }}
            </div>

            <div class="col-span-2 space-y-1 border-t-4 border-b-4 border-darkred-red rounded-xl py-2 px-1">
                <h3 class="text-center text-lg font-semibold p-1 border-2 border-darkred-dark rounded-xl">Урон:</h3>
                <div v-for="d in weapon_selected.damage"
                    class="col-span-2 text-md p-1 border-2 border-darkred-dark rounded-xl text-center">
                    <span>{{ d.type }}: {{ d.damage }}</span class="font-medium">
                </div>
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