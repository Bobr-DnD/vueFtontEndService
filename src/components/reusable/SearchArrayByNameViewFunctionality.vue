<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { groupById } from '/utils/entityHelper'
import PerkRowView from '../character-page components/EntityRows/PerkRowView.vue'

const props = defineProps({
    array: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    perkRemovable: {
        type: Boolean,
        default: false
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
    const groupedArray = groupById(props.array)

    if (!searchQuery.value.trim()) return groupedArray
    const query = searchQuery.value.toLowerCase()
    return groupedArray.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

</script>

<template>
    <div class="w-full flex flex-col items-center gap-4 p-2">

        <div class="w-full grid items-center gap-2" :class="searchQuery ? 'grid-cols-[1fr_56px]' : 'grid-cols-1'">
            <input v-model="searchQuery" type="text" :placeholder="label" class="w-full p-3 rounded-md bg-darkred-dark text-darkred-light border-2 border-darkred-red
               font-gothic text-lg focus:outline-none focus:ring-2 focus:ring-darkred-red
               placeholder-darkred-light/80 transition-all duration-200" />
            <button v-if="searchQuery" @click="searchQuery = ''"
                class="px-3 py-2 w-14 flex justify-center items-center bg-darkred-red text-darkred-light rounded-md font-bold text-xl md:hover:bg-darkred-bright md:hover:text-darkred-dark transition-all">
                <XMarkIcon class="h-8 w-8"/>
            </button>
        </div>

        <div v-if="filteredArray.length > 0"
            class="w-full grid grid-cols-1 h-fit max-h-96 overflow-y-scroll no-scrollbar">
            <section class="flex flex-col gap-2">

                <div v-for="el in filteredArray" :key="el.id" class="grid grid-cols-1 h-fit p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium">

                    <div class="w-full grid p-2 gap-2 items-center justify-items-start font-gothic" :class="props.perkRemovable ? 'grid-cols-[1fr_44px]' : 'grid-cols-1'"
                        v-if="props.type === 'perk'">
                        <PerkRowView :perk="el" :callback="props.callback" :removable="props.perkRemovable" />
                    </div>

                </div>
            </section>

        </div>

        <div v-else class="text-lg font-gothic italic text-darkred-dark font-medium">
            Нічого не знайдено
        </div>
    </div>
</template>