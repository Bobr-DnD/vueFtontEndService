<script setup>
import { ref, nextTick, computed } from 'vue'
import { groupById, removeRow, addRow } from '/utils/entityHelper'
import DeleteButton from '../reusable/DeleteButton.vue'

const props = defineProps({
    armors_all: {
        type: Array,
        required: true
    },
    armors: {
        type: Array,
        required: true
    }
})

const groupedArmors = computed(() => groupById(props.armors))
let armor_selected = ref({})
let block_hidden = ref(true)

function showDetails(id) {
    armor_selected.value = props.armors_all.find(w => w.id === id)
    nextTick(() => {
        block_hidden.value = false
    })
}

function addItem(event) {
    const id = event.target.value
    addRow(props.armors_all, props.armors, id)
    event.target.value = 'default'
}
</script>

<template>
    <div v-for="armor, index in groupedArmors"
        class="grid grid-cols-[20px_1fr_1fr_1fr_1fr_1fr_30px] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2 hover:cursor-pointer"
        :id="'Armor' + `${index + 1}`" @click.prevent="showDetails(armor.id)">

        <div class="text-darkred-light row-span-3">×{{ armor.count }}</div>

        <div class="col-span-5 p2 text-clip">{{ armor.name }}</div>

        <DeleteButton @click.stop="removeRow(props.armors, armor.id)"
            class="row-span-3" />

        <div v-if="armor.requirement" class="col-span-3 p2 text-clip">Вимоги:
            {{Object.entries(armor.requirement).map(([key, value]) =>
                `${key}:${value}`).join(', ')}}</div>

        <div v-else class="col-span-3 p2 text-clip">Вимоги відсутні</div>

        <div class="col-span-2 p2 text-clip">Захист: {{ armor.resist }}</div>

        <div v-if="armor.effect" class="col-span-2 p2 text-clip">Ефект: {{ armor.effect }}</div>

        <div v-else class="col-span-5 p2 text-clip">Ефект відсутній</div>

    </div>

    <select name="Armors" id="Armors" @change="addItem($event)" :class="['w-full h-12 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть броню</option>

        <option v-for="armor in props.armors_all" :value="armor.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ armor.name }} </option>

    </select>

    <div v-if="!block_hidden" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div
            class="w-80 p-5 grid grid-cols-2 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-univers">

            <div @click="block_hidden = true"
                class="absolute top-2 right-2 px-3 py-1 bg-darkred-red border border-darkred-dark rounded-md text-darkred-light font-bold cursor-pointer hover:bg-darkred-bright transition select-none">
                ✕
            </div>

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