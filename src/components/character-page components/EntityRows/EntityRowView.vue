<script setup>
import { ref, onBeforeUnmount } from 'vue';
import VerticalNumberPicker from '@/components/reusable/VerticalNumberPicker.vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import { checkArrayFieldExisting, checkObjectFieldExisting } from '@utils/entityHelper';

const props = defineProps({
    entity: {
        type: Object,
        required: true
    },
    callback_change_count: {
        type: Function,
        required: true
    },
    owned: {
        type: Boolean,
        default: false
    },
    expanded: {
        type: Boolean,
        default: false
    },
    callback_toggle: {
        type: Function,
        required: true
    }
})

const valueToChange = ref(0)
const lastChange = ref(0)

let hideTimeoutId = null

function handleRelease(delta) {
    props.callback_change_count(props.entity, delta)

    lastChange.value = delta
    if (hideTimeoutId) clearTimeout(hideTimeoutId)
    hideTimeoutId = setTimeout(() => {
        lastChange.value = 0
        hideTimeoutId = null
    }, 3000)
}

onBeforeUnmount(() => {
    if (hideTimeoutId) clearTimeout(hideTimeoutId)
})

</script>

<template>
    <div class="w-full relative">

        <div @click="props.callback_toggle(props.entity)"
            :class="props.owned ? 'border-l-4 border-l-greenish-mid' : 'border-l-4 border-l-darkred-gray'"
            class="p-2 w-full bg-darkred-dark text-darkred-light border-2 rounded-2xl
            grid grid-cols-4 gap-2 justify-items-center font-univers font-medium text-lg md:hover:cursor-pointer">

            <div class="col-span-4 w-full grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xl font-semibold">
                <div class="justify-self-start flex items-center gap-1">
                    <span>{{ props.entity.count ? `x${props.entity.count}` : '' }}</span>
                    <span v-if="lastChange !== 0" class="text-sm"
                        :class="lastChange > 0 ? 'text-greenish-light' : 'text-darkred-red'">
                        {{ lastChange > 0 ? `+${lastChange}` : lastChange }}
                    </span>
                </div>
                <div class="justify-self-center">{{ props.entity.name }}</div>
                <ChevronDownIcon class="w-5 h-5 justify-self-end text-darkred-light transition-transform duration-200"
                    :class="props.expanded ? 'rotate-180' : ''" />
            </div>

            <div class="col-span-4 w-full grid transition-all duration-300 ease-in-out"
                :class="props.expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
                <div class="overflow-hidden">

                    <div class="col-span-4 w-full flex flex-col gap-2 pt-2 md:hover:cursor-default" @click.stop>

                        <div v-if="props.entity.image">
                            <img class="w-full h-40 object-cover border-4 border-darkred-bright rounded-lg shadow-lg"
                                :src="props.entity.image" alt="Entity image" />
                        </div>

                        <div v-if="props.entity.description" class="justify-self-start">Опис: {{ props.entity.description }}</div>

                        <div v-if="checkObjectFieldExisting(props.entity.characteristics)" class="w-full flex flex-wrap gap-1 bg-darkred-brown rounded-lg">

                            <div class="basis-full text-center text-xl p-1">Характеристики: </div>

                            <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                                <div v-for="value, name in props.entity.characteristics" :key="Math.random().toString(24).slice(2)"
                                    class="py-1 px-2 rounded-lg even:bg-darkred-light_gray ">
                                    {{ name }}: {{ value }}
                                </div>
                            </div>

                        </div>

                        <div v-if="props.entity.requirement" class="w-full flex flex-wrap gap-1 bg-darkred-brown rounded-lg">

                            <div class="basis-full text-center text-xl p-1">Вимоги: </div>

                            <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                                <div v-for="value, name in props.entity.requirement" :key="Math.random().toString(24).slice(2)"
                                    class="py-1 px-2 rounded-lg even:bg-darkred-light_gray ">
                                    {{ name }}: {{ value }}
                                </div>
                            </div>

                        </div>

                        <div v-if="checkArrayFieldExisting(props.entity.effects)" class="w-full flex flex-wrap gap-1 bg-darkred-brown rounded-lg">

                            <div class="basis-full text-center text-xl p-1">Ефекти: </div>

                            <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                                <div class="grid grid-cols-2 py-1 px-2 rounded-lg bg-darkred-light">
                                    <div>Назва</div>
                                    <div>Опис</div>
                                </div>

                                <div v-for="value in props.entity.effects" :key="value.id"
                                    class="py-1 px-2 rounded-lg even:bg-darkred-light_gray grid grid-cols-2">
                                    <div>
                                        {{ value.name }}:
                                    </div>
                                    <div>
                                        {{ value.description }}
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div v-if="props.entity.price || props.entity.rarity"
                            class="p-1 w-full rounded-lg bg-darkred-brown flex flex-col flex-wrap gap-1">

                            <div v-if="props.entity.price"
                                class="rounded-lg odd:bg-darkred-light even:bg-darkred-light_gray py-1 px-2 bg-darkred-light text-darkred-dark">
                                Ціна: {{ props.entity.price }}
                            </div>

                            <div v-if="props.entity.rarity"
                                class="rounded-lg odd:bg-darkred-light even:bg-darkred-light_gray py-1 px-2 bg-darkred-light text-darkred-dark">
                                Рідкість: {{ props.entity.rarity }}
                            </div>

                        </div>

                        <VerticalNumberPicker :max-num="15" :min-num="-props.entity.count" :price="props.entity.price"
                            v-model:model-value="valueToChange" @release="handleRelease" />

                    </div>

                </div>
            </div>

        </div>

    </div>

</template>
