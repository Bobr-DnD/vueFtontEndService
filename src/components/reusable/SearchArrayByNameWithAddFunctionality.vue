<script setup>
import { ref, computed } from 'vue'
import ApproveButton from './Buttons/ApproveButton.vue'
import PerkRowSelect from '../character-page components/EntityRows/PerkRowSelect.vue'
import WeaponRowView from '../character-page components/EntityRows/WeaponRowView.vue'
import ArmorRowView from '../character-page components/EntityRows/ArmorRowView.vue'
import MedicineRowView from '../character-page components/EntityRows/MedicineRowView.vue'
import InventoryRowView from '../character-page components/EntityRows/InventoryRowView.vue'

const props = defineProps({
    array: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        validator: value =>
            ['perk', 'weapon', 'armor', 'inventory', 'medicine'].includes(value)
    },
    callback: {
        type: Function,
        required: true
    }
})

const label = `🔍 Пошук ${props.label} ...`
const searchQuery = ref('')

const filteredArray = computed(() => {
    if (!searchQuery.value.trim()) return props.array
    const query = searchQuery.value.toLowerCase()
    return props.array.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

</script>

<template>
    <div class="w-full flex flex-col items-center gap-4 p-4">

        <div class="w-full grid items-center gap-2" :class="searchQuery ? 'grid-cols-[1fr_56px]' : 'grid-cols-1'">
            <input v-model="searchQuery" type="text" :placeholder="label" class="w-full p-3 rounded-md bg-darkred-dark text-darkred-light border-2 border-darkred-red
               font-gothic text-lg focus:outline-none focus:ring-2 focus:ring-darkred-red
               placeholder-darkred-light/80 transition-all duration-200" />
            <button v-if="searchQuery" @click="searchQuery = ''"
                class="px-3 py-2 w-14 bg-darkred-red text-darkred-light rounded-md font-bold text-xl md:hover:bg-darkred-light md:hover:text-darkred-dark transition-all">
                ✕
            </button>
        </div>

        <div v-if="filteredArray.length > 0" class="w-full grid grid-cols-1 h-96 overflow-y-scroll no-scrollbar">
            <section class="flex flex-col gap-2">

                <div v-for="el in filteredArray" :key="el.id" class="grid grid-cols-[1fr_64px] h-fit p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium overflow-hidden text-ellipsis">

                    <div class="grid p-2 gap-2 items-center justify-items-start" v-if="props.type === 'perk'">
                        <PerkRowSelect :perk="el" />
                    </div>

                    <div class="grid grid-cols-[1fr_1fr_1fr] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic"
                        v-if="props.type === 'weapon'">
                        <!-- <WeaponRowView :weapon="el" :removable="false" /> -->
                    </div>

                    <div class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic" v-if="props.type === 'armor'">
                        <!-- <ArmorRowView :armor="el" :removable="false" /> -->
                    </div>

                    <div class="grid grid-cols-[1fr_1fr] p-2 gap-2 items-center justify-items-center font-gothic" v-if="props.type === 'inventory'">
                        <!-- <InventoryRowView :inv="el" :removable="false" /> -->
                    </div>

                    <div class="grid p-2 gap-2 items-center justify-items-start font-gothic"
                        v-if="props.type === 'medicine'">
                        <!-- <MedicineRowView :med="el" :removable="false" :usable="false" /> -->
                    </div>

                    <ApproveButton @click="props.callback(el)" class="w-16" />

                </div>
            </section>

        </div>

        <div v-else class="text-lg font-gothic italic text-darkred-light">
            Нічого не знайдено
        </div>
    </div>
</template>