<script setup>
import { ref, computed } from 'vue'
import ApproveButton from './Buttons/ApproveButton.vue'
import PerkTable from '../character-page components/EntityTables/PerkTable.vue'
import WeaponTable from '../character-page components/EntityTables/WeaponTable.vue'
import ArmorTable from '../character-page components/EntityTables/ArmorTable.vue'
import MedsTable from '../character-page components/EntityTables/MedsTable.vue'
import InventoryTable from '../character-page components/EntityTables/InventoryTable.vue'

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

        <div class="w-full grid grid-cols-[1fr_56px] items-center gap-2">
            <input v-model="searchQuery" type="text" :placeholder="label" class="w-full p-3 rounded-md bg-fallout.blackish text-fallout.sand border-2 border-fallout.red
               font-gothic text-lg focus:outline-none focus:ring-2 focus:ring-fallout.red
               placeholder-fallout.sand/40 transition-all duration-200" />
            <button v-if="searchQuery" @click="searchQuery = ''"
                class="px-3 py-2 w-14 bg-darkred-red text-darkred-light rounded-md font-bold text-xl md:hover:bg-fallout.sand md:hover:text-fallout.blackish transition-all">
                ✖
            </button>
        </div>

        <div v-if="filteredArray.length > 0" class="w-full grid grid-cols-1 h-96 overflow-y-scroll no-scrollbar">
            <section class="flex flex-col gap-2">

                <div v-for="el in filteredArray" :key="el.id" class="grid grid-cols-[1fr_64px] h-fit p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium">

                    <div v-if="props.type === 'perk'">
                        <PerkTable :perk="el" :removable="false" />
                    </div>

                    <div v-if="props.type === 'weapon'">
                        <WeaponTable :weapon="el" :removable="false"/>
                    </div>

                    <div v-if="props.type === 'armor'">
                        <ArmorTable :armor="el" :removable="false"/>
                    </div>

                    <div v-if="props.type === 'inventory'">
                        <InventoryTable :inv="el" :removable="false"/>
                    </div>

                    <div v-if="props.type === 'medicine'">
                        <MedsTable :med="el" :removable="false" :usable="false"/>
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