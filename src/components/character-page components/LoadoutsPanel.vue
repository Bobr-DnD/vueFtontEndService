<script setup>
import { ref, computed, watch } from 'vue';
import { notify } from '/utils/notification';
import { groupById } from '/utils/entityHelper';
import { returnIcon } from '/utils/icons';

const props = defineProps({
    entities: {
        type: Array,
        required: true
    },
    perks: {
        type: Array,
        required: true
    },
    loadoutLimits: {
        type: Object,
        default: () => ({ loadouts: null, items: null, perks: null })
    },
    entityTypes: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const loadouts = defineModel('loadouts', { type: Array, default: () => [] })

const activeLoadoutId = ref(null)
const activeFilter = ref('all')

watch(loadouts, (list) => {
    if (!list.find(l => l.id === activeLoadoutId.value)) {
        activeLoadoutId.value = list[0]?.id ?? null
    }
}, { immediate: true, deep: false })

const activeLoadout = computed(() => loadouts.value.find(l => l.id === activeLoadoutId.value) ?? null)

const loadoutsMaxReached = computed(() => Boolean(props.loadoutLimits?.loadouts) && loadouts.value.length >= props.loadoutLimits.loadouts)

function typeLabel(entity) {
    return entity.type?.name ?? entity.type ?? ''
}

function typeIcon(entity) {
    const typeId = entity.type?.id ?? entity.type
    const type = props.entityTypes.find(t => t.id === typeId)
    return returnIcon(type?.icon)?.icon ?? null
}

const filterOptions = computed(() => {
    const known = new Map(props.entityTypes.map(t => [t.id, t.name]))
    const unique = [...new Set(props.entities.map(typeLabel).filter(Boolean).map(t => known.get(t) ?? t))]
    return [{ id: 'all', label: 'Усі' }, ...unique.map(t => ({ id: t, label: t })), { id: 'perks', label: 'Перки' }]
})

function findEntity(id) {
    return props.entities.find(e => e.id === id) ?? null
}

function findPerk(id) {
    return uniquePerks.value.find(p => p.id === id) ?? null
}

function buildSlots(ids, resolver, limit) {
    const filled = ids.map(id => ({ id, item: resolver(id) }))
    if (!limit) return filled
    const placeholders = Math.max(limit - filled.length, 0)
    return [...filled, ...Array.from({ length: placeholders }, () => ({ id: null, item: null }))]
}

const itemSlots = computed(() => buildSlots(activeLoadout.value?.itemsIds ?? [], findEntity, props.loadoutLimits?.items))
const perkSlots = computed(() => buildSlots(activeLoadout.value?.perksIds ?? [], findPerk, props.loadoutLimits?.perks))

const uniqueEntities = computed(() => groupById(props.entities))
const uniquePerks = computed(() => groupById(props.perks))

const inventoryList = computed(() => {
    const list = []

    if (activeFilter.value !== 'perks') {
        uniqueEntities.value
            .filter(e => activeFilter.value === 'all' || typeLabel(e) === activeFilter.value || (props.entityTypes.find(t => t.id === e.type)?.name === activeFilter.value))
            .forEach(e => list.push({
                id: e.id,
                name: e.name,
                count: e.count,
                sub: typeLabel(e),
                icon: typeIcon(e),
                isPerk: false,
                inLoadout: activeLoadout.value?.itemsIds.includes(e.id) ?? false
            }))
    }

    if (activeFilter.value === 'all' || activeFilter.value === 'perks') {
        uniquePerks.value.forEach(p => list.push({
            id: p.id,
            name: p.name,
            count: p.count,
            sub: p.type?.name ?? '',
            isPerk: true,
            inLoadout: activeLoadout.value?.perksIds.includes(p.id) ?? false
        }))
    }

    return list
})

function selectLoadout(id) {
    activeLoadoutId.value = id
}

function addLoadout() {
    if (loadoutsMaxReached.value) {
        notify({ message: 'Досягнуто ліміту лоадаутів', type: 'warning' })
        return
    }

    const name = prompt('Назва лоадауту:')
    if (!name) return

    const loadout = { id: crypto.randomUUID(), name, itemsIds: [], perksIds: [] }
    loadouts.value.push(loadout)
    activeLoadoutId.value = loadout.id
    props.callback()
}

function removeLoadout(id) {
    const confirmed = confirm('Видалити цей лоадаут?')
    if (!confirmed) return

    const index = loadouts.value.findIndex(l => l.id === id)
    if (index === -1) return

    loadouts.value.splice(index, 1)
    if (activeLoadoutId.value === id) activeLoadoutId.value = loadouts.value[0]?.id ?? null
    props.callback()
}

function removeItem(id) {
    const index = activeLoadout.value.itemsIds.indexOf(id)
    if (index !== -1) activeLoadout.value.itemsIds.splice(index, 1)
    props.callback()
}

function removePerkFromLoadout(id) {
    const index = activeLoadout.value.perksIds.indexOf(id)
    if (index !== -1) activeLoadout.value.perksIds.splice(index, 1)
    props.callback()
}

function toggleEntity(id) {
    const list = activeLoadout.value.itemsIds
    const index = list.indexOf(id)

    if (index !== -1) {
        list.splice(index, 1)
        props.callback()
        return
    }

    if (props.loadoutLimits?.items && list.length >= props.loadoutLimits.items) {
        notify({ message: 'Досягнуто ліміту предметів для лоадауту', type: 'warning' })
        return
    }

    list.push(id)
    props.callback()
}

function togglePerk(id) {
    const list = activeLoadout.value.perksIds
    const index = list.indexOf(id)

    if (index !== -1) {
        list.splice(index, 1)
        props.callback()
        return
    }

    if (props.loadoutLimits?.perks && list.length >= props.loadoutLimits.perks) {
        notify({ message: 'Досягнуто ліміту перків для лоадауту', type: 'warning' })
        return
    }

    list.push(id)
    props.callback()
}

function toggleInventoryItem(item) {
    if (!activeLoadout.value) return
    if (item.isPerk) togglePerk(item.id)
    else toggleEntity(item.id)
}

</script>

<template>
    <div class="p-4 rounded-2xl bg-darkred-dark text-darkred-light font-gothic">

        <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-semibold text-darkred-bright">⚔ Профілі</span>
            <span class="text-xs text-darkred-light_gray border-2 border-darkred-dark_gray rounded-full px-3 py-1">{{
                loadouts.length }} / {{ loadoutLimits?.loadouts ?? '∞' }} профілів</span>
        </div>

        <div class="flex gap-2 flex-wrap mb-4">
            <button v-for="l in loadouts" :key="l.id" @click="selectLoadout(l.id)"
                :class="l.id === activeLoadoutId ? 'bg-darkred-gray border-darkred-gray' : 'border-darkred-dark_gray'"
                class="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm md:hover:bg-darkred-gray/60 md:hover:cursor-pointer transition-colors">
                {{ l.name }}
                <span @click.stop="removeLoadout(l.id)"
                    class="opacity-0 group-hover:opacity-100 text-xs md:hover:text-darkred-bright transition-opacity">✕</span>
            </button>

            <button v-if="!loadoutsMaxReached" @click="addLoadout"
                class="px-3 py-1.5 rounded-full border-2 border-dashed border-darkred-dark_gray text-sm text-darkred-light_gray md:hover:bg-darkred-gray/60 md:hover:cursor-pointer transition-colors">
                + Новий
            </button>
        </div>

        <div v-if="!activeLoadout" class="text-center italic text-darkred-light_gray py-6">Немає жодного профіля.
            Створіть перший.</div>

        <template v-else>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div
                        class="text-xs uppercase tracking-wider text-darkred-light_gray border-b-2 border-darkred-dark_gray pb-1 mb-2">
                        Екіпіроване спорядження</div>

                    <div class="flex flex-col gap-1.5">

                        <div v-for="(slot, i) in itemSlots" :key="slot.id ?? `empty-item-${i}`"
                            :class="slot.item ? 'border-darkred-gray' : 'border-darkred-dark_gray'"
                            class="group relative flex items-center gap-2.5 border-2 rounded-lg px-2.5 py-2 bg-darkred-dark_gray/40 md:hover:bg-darkred-gray/20 md:hover:cursor-pointer transition-colors"
                            @click="!slot.item && (activeFilter = 'all')">

                            <template v-if="slot.item">
                                <div
                                    class="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0 overflow-hidden bg-darkred-red/20">
                                    <component :is="typeIcon(slot.item)" v-if="typeIcon(slot.item)" class="w-4 h-4" />
                                    <span v-else>📦</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium text-darkred-light text-ellipsis">{{ slot.item.name
                                        }}
                                    </div>
                                    <div v-if="slot.item.description"
                                        class="text-xs text-darkred-light_gray italic text-ellipsis">{{
                                        slot.item.description }}</div>
                                </div>
                                <div @click.stop="removeItem(slot.id)"
                                    class="opacity-0 group-hover:opacity-100 w-[18px] h-[18px] flex items-center justify-center text-darkred-light_gray text-sm shrink-0 md:hover:text-darkred-bright transition-opacity">
                                    ✕</div>
                            </template>

                            <template v-else>
                                <div
                                    class="w-7 h-7 rounded-md shrink-0 bg-darkred-dark border-2 border-dashed border-darkred-dark_gray">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-xs text-darkred-light_gray italic">— порожній слот —</div>
                                </div>
                            </template>

                        </div>

                        <div v-if="!itemSlots.length" class="text-xs text-darkred-light_gray italic text-center py-3">
                            Немає предметів</div>

                    </div>
                </div>

                <div>
                    <div
                        class="text-xs uppercase tracking-wider text-darkred-light_gray border-b-2 border-darkred-dark_gray pb-1 mb-2">
                        Активні перки</div>

                    <div class="flex flex-col gap-1.5">

                        <div v-for="(slot, i) in perkSlots" :key="slot.id ?? `empty-perk-${i}`"
                            :class="slot.item ? 'border-darkred-gray' : 'border-darkred-dark_gray'"
                            class="group relative flex items-center gap-2.5 border-2 rounded-lg px-2.5 py-2 bg-darkred-dark_gray/40 md:hover:bg-darkred-gray/20 md:hover:cursor-pointer transition-colors"
                            @click="!slot.item && (activeFilter = 'perks')">

                            <template v-if="slot.item">
                                <div
                                    class="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0 bg-darkred-brown">
                                    ✦</div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium text-darkred-light text-ellipsis">{{ slot.item.name
                                        }}
                                    </div>
                                    <div v-if="slot.item.description"
                                        class="text-xs text-darkred-light_gray italic text-ellipsis">{{
                                            slot.item.description }}</div>
                                    <div v-if="slot.item.count && slot.item.levels?.[slot.item.count - 1]"
                                        class="text-xs text-darkred-light_gray italic text-ellipsis">{{
                                            slot.item.levels[slot.item.count - 1].name }}</div>
                                </div>
                                <div @click.stop="removePerkFromLoadout(slot.id)"
                                    class="opacity-0 group-hover:opacity-100 w-[18px] h-[18px] flex items-center justify-center text-darkred-light_gray text-sm shrink-0 md:hover:text-darkred-bright transition-opacity">
                                    ✕</div>
                            </template>

                            <template v-else>
                                <div
                                    class="w-7 h-7 rounded-md shrink-0 bg-darkred-dark border-2 border-dashed border-darkred-dark_gray">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-xs text-darkred-light_gray italic">— порожній слот —</div>
                                </div>
                            </template>

                        </div>

                        <div v-if="!perkSlots.length" class="text-xs text-darkred-light_gray italic text-center py-3">
                            Немає перків</div>

                    </div>
                </div>
            </div>

            <div class="mt-4 border-t-2 border-darkred-dark_gray pt-4">

                <div class="flex gap-1.5 flex-wrap mb-2.5">
                    <button v-for="f in filterOptions" :key="f.id" @click="activeFilter = f.id"
                        :class="activeFilter === f.id ? 'bg-darkred-gray border-darkred-gray text-darkred-light' : 'border-darkred-dark_gray text-darkred-light_gray'"
                        class="text-xs px-2.5 py-1 rounded-full border-2 md:hover:bg-darkred-gray/60 md:hover:cursor-pointer transition-colors">
                        {{ f.label }}
                    </button>
                </div>

                <div class="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-1.5">
                    <div v-for="it in inventoryList" :key="`${it.isPerk ? 'perk' : 'entity'}-${it.id}`"
                        @click="toggleInventoryItem(it)"
                        :class="it.inLoadout ? 'border-darkred-bright bg-darkred-red/10' : 'border-darkred-dark_gray'"
                        class="flex items-center gap-2 border-2 rounded-lg px-2.5 py-2 md:hover:bg-darkred-gray/20 md:hover:cursor-pointer transition-colors">

                        <div class="w-6 h-6 rounded flex items-center justify-center text-xs shrink-0"
                            :class="it.isPerk ? 'bg-darkred-brown' : 'bg-darkred-red/20'">
                            <component :is="it.icon" v-if="it.icon" class="w-3.5 h-3.5" />
                            <span v-else>{{ it.isPerk ? '✦' : '📦' }}</span>
                        </div>

                        <div>
                            <div class="text-xs font-medium text-ellipsis"
                                :class="it.inLoadout ? 'text-darkred-bright' : 'text-darkred-light'">
                                {{ it.name }}<span v-if="it.count > 1"> x{{ it.count }}</span>
                                <span v-if="it.inLoadout" class="text-greenish-mid text-sm">✓</span>
                            </div>
                        </div>

                    </div>

                    <div v-if="!inventoryList.length"
                        class="text-xs text-darkred-light_gray italic text-center py-3 col-span-full">
                        Нічого не
                        знайдено</div>
                </div>

            </div>
        </template>

    </div>
</template>
