<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';

import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import DiceLoader from '@/components/reusable/Loaders/DiceLoader.vue';

const sessionId = useRoute().params.sessionId

const AUTO_REFRESH_MS = 5000
const LIMIT = 50

const logs = ref([])
const total = ref(0)
const page = ref(1)
const isLoading = ref(false)
const autoRefresh = ref(true)

const characterNameFilter = ref('')
const eventFilter = ref('')

let intervalId = null

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / LIMIT)))

async function fetchLogs() {
    isLoading.value = true

    const [res, err] = await asyncHandler(
        RepositoryFactory.getLogs({
            page: page.value,
            limit: LIMIT,
            sessionId,
            characterName: characterNameFilter.value || undefined,
            event: eventFilter.value || undefined
        })
    )

    isLoading.value = false
    if (err) return

    logs.value = res.data.logs
    total.value = res.data.total
}

function applyFilters() {
    page.value = 1
    fetchLogs()
}

function resetFilters() {
    characterNameFilter.value = ''
    eventFilter.value = ''
    page.value = 1
    fetchLogs()
}

function nextPage() {
    if (page.value >= totalPages.value) return
    page.value++
    fetchLogs()
}

function prevPage() {
    if (page.value <= 1) return
    page.value--
    fetchLogs()
}

function formatTime(isoDate) {
    return new Date(isoDate).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'medium' })
}

function startAutoRefresh() {
    stopAutoRefresh()
    intervalId = setInterval(fetchLogs, AUTO_REFRESH_MS)
}

function stopAutoRefresh() {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
}

watch(autoRefresh, (value) => {
    if (value) startAutoRefresh()
    else stopAutoRefresh()
})

onMounted(() => {
    fetchLogs()
    if (autoRefresh.value) startAutoRefresh()
})

onBeforeUnmount(() => {
    stopAutoRefresh()
})

</script>

<template>
    <MasterPageNavigation />

    <section class="p-4 flex flex-col gap-4 font-gothic text-darkred-dark">

        <Header1 label="Логи вебсокетів" />

        <div class="w-full flex flex-wrap items-end gap-2">
            <div class="w-56 flex flex-col gap-1">
                <span class="text-sm">Ім'я персонажа</span>
                <SearchInputBlack v-model:searchQuery="characterNameFilter" />
            </div>

            <div class="w-56 flex flex-col gap-1">
                <span class="text-sm">Подія</span>
                <SearchInputBlack v-model:searchQuery="eventFilter" />
            </div>

            <AprroveButtonWithText text="Застосувати" class="w-40" @click="applyFilters" />
            <RejectButtonWithText text="Скинути" class="w-32" @click="resetFilters" />

            <label class="flex items-center gap-2 ml-auto text-sm select-none md:hover:cursor-pointer">
                <input type="checkbox" v-model="autoRefresh" class="w-4 h-4" />
                Автооновлення ({{ AUTO_REFRESH_MS / 1000 }}с)
            </label>
        </div>

        <div class="w-full flex-1 rounded-xl border-2 border-darkred-dark_gray overflow-hidden flex flex-col">

            <div v-if="isLoading && !logs.length" class="w-full flex items-center justify-center p-8">
                <DiceLoader/>
            </div>

            <div v-else-if="!logs.length" class="w-full flex items-center justify-center p-8 text-darkred-light_gray">
                Логів не знайдено
            </div>

            <div v-else class="w-full overflow-auto max-h-[70vh]">
                <table class="w-full text-left text-sm font-univers border-collapse">
                    <thead class="sticky top-0 bg-darkred-light">
                        <tr>
                            <th class="p-2 border-b border-darkred-gray">Час</th>
                            <th class="p-2 border-b border-darkred-gray">Персонаж</th>
                            <th class="p-2 border-b border-darkred-gray">Роль</th>
                            <th class="p-2 border-b border-darkred-gray">Подія</th>
                            <th class="p-2 border-b border-darkred-gray">Дані</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in logs" :key="log.id" class="odd:bg-darkred-dark_gray/40">
                            <td class="p-2 align-top whitespace-nowrap">{{ formatTime(log.createdAt) }}</td>
                            <td class="p-2 align-top whitespace-nowrap">{{ log.characterName || log.characterId || '—' }}</td>
                            <td class="p-2 align-top whitespace-nowrap">{{ log.role || '—' }}</td>
                            <td class="p-2 align-top whitespace-nowrap font-semibold">{{ log.event }}</td>
                            <td class="p-2 align-top max-w-xs truncate" :title="log.payload || ''">
                                {{ log.message || log.payload || '—' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <div class="w-full flex items-center justify-center gap-4">
            <RejectButtonWithText text="Назад" class="w-32" @click="prevPage" />
            <div class="text-sm">Сторінка {{ page }} з {{ totalPages }} ({{ total }} записів)</div>
            <AprroveButtonWithText text="Далі" class="w-32" @click="nextPage" />
        </div>

    </section>
</template>
