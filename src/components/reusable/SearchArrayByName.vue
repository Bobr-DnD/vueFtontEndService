<script setup>
import { ref, computed } from 'vue'
import ApproveButton from './Buttons/ApproveButton.vue'

const props = defineProps({
    array: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: true
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

                    <div>
                        <div v-if="el.type === 'perk'" class="p2 text-clip">{{ el.name }} <sup
                                class="text-greenish-mid">Перк</sup></div>
                        <div v-else-if="el.type === 'status'" class="p2 text-clip">{{ el.name }} <sup
                                class="text-orange-gold">Статус</sup></div>
                        <div v-else-if="el.type === 'skill'" class="p2 text-clip">{{ el.name }} <sup
                                class="text-orange-orange">Навичка</sup></div>
                        <div v-else class="p2 text-clip">{{ el.name }}</div>
                    </div>

                    <ApproveButton @click="props.callback(el)" class="w-16 row-span-2" />

                    <div v-if="el.effect.description">{{ el.effect.description }}</div>

                </div>
            </section>

        </div>

        <div v-else class="text-lg font-gothic italic text-darkred-light">
            Нічого не знайдено
        </div>
    </div>
</template>