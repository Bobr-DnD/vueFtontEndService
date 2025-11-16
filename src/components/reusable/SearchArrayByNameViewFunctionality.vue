<script setup>
import { ref, computed } from 'vue'
import WeaponTable from '../character-page components/EntityTables/WeaponTable.vue'
import ArmorTable from '../character-page components/EntityTables/ArmorTable.vue'
import PerkTable from '../character-page components/EntityTables/PerkTable.vue'
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
    },
    callbackModal: {
        type: Function,
        required: false,
        default: () => { console.log('There is no modal for this item, silly') }
    },
    callbackMedUse: {
        type: Function,
        required: false,
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
    <div class="w-full flex flex-col items-center gap-4 p-2">

        <div class="w-full grid grid-cols-[1fr_56px] items-center gap-2">
            <input v-model="searchQuery" type="text" :placeholder="label" class="w-full p-3 rounded-md bg-fallout.blackish text-fallout.sand border-2 border-fallout.red
               font-gothic text-lg focus:outline-none focus:ring-2 focus:ring-fallout.red
               placeholder-fallout.sand/40 transition-all duration-200" />
            <button v-if="searchQuery" @click="searchQuery = ''"
                class="px-3 py-2 w-14 bg-darkred-red text-darkred-light rounded-md font-bold text-xl md:hover:bg-fallout.sand md:hover:text-fallout.blackish transition-all">
                ✖
            </button>
        </div>

        <div v-if="filteredArray.length > 0"
            class="w-full grid grid-cols-1 h-fit max-h-96 overflow-y-scroll no-scrollbar">
            <section class="flex flex-col gap-2">

                <div v-for="el in filteredArray" :key="el.id" class="grid grid-cols-1 h-fit p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium">

                    <div class="w-full grid p-2 gap-2 items-center justify-items-start font-gothic"
                        v-if="props.type === 'perk'">
                        <PerkTable :perk="el" :callback="props.callback" :removable="false" />
                    </div>

                    <div class="w-full grid grid-cols-[20px_1fr_1fr_1fr_30px] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic md:hover:cursor-pointer"
                        v-if="props.type === 'weapon'" @click="props.callbackModal(el.id)">
                        <WeaponTable :weapon="el" :callback="props.callback" />
                    </div>

                    <div class="w-full grid grid-cols-[20px_1fr_1fr_1fr_1fr_1fr_30px] grid-rows-3 p-2 gap-2 items-center justify-items-center font-gothic md:hover:cursor-pointer"
                        v-if="props.type === 'armor'" @click="props.callbackModal(el.id)">
                        <ArmorTable :armor="el" :callback="props.callback" />
                    </div>

                    <div class="w-full grid grid-cols-[20px_1fr_1fr_30px] p-2 gap-2 items-center justify-items-center font-gothic md:hover:cursor-pointer"
                        v-if="props.type === 'inventory'" @click="props.callbackModal(el.id)">
                        <InventoryTable :inv="el" :callback="props.callback" />
                    </div>

                    <div class="w-full grid p-2 gap-2 items-center justify-items-start font-gothic md:hover:cursor-pointer"
                        :class="el.effect ? 'grid-cols-[20px_1fr_1fr_30px_30px]' : 'grid-cols-[20px_1fr_1fr_30px]'"
                        v-if="props.type === 'medicine'" @click="props.callbackModal(el.id)">
                        <MedsTable :med="el" :callbackDelete="props.callback" :callbackUse="props.callbackMedUse" />
                    </div>

                </div>
            </section>

        </div>

        <div v-else class="text-lg font-gothic italic text-darkred-dark font-medium">
            Нічого не знайдено
        </div>
    </div>
</template>