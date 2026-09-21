<script setup>
import { computed, ref } from 'vue';
import PerkModal from '../EntityModals/PerkModal.vue';
import { CursorArrowRippleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    perk: {
        type: Object,
        required: true
    },
    callback_level_up: {
        type: Function,
        required: true
    },
    callback_level_down: {
        type: Function,
        required: true
    },
    callback_remove: {
        type: Function,
        required: true
    },
    levelUpDisabled: {
        type: Boolean,
        default: false
    }
})

const modalHidden = ref(true)

const maxLevel = computed(() => props.perk.levels?.length || 1)
const owned = computed(() => props.perk.count > 0)
const canLevelUp = computed(() => props.perk.count < maxLevel.value && !props.levelUpDisabled)
const canLevelDown = computed(() => props.perk.count > 0)

</script>

<template>
    <div class="relative">

        <div @click="modalHidden = !modalHidden" :class="[
            owned ? 'border-l-4 border-greenish-mid' : 'border-l-4 border-darkred-gray'
        ]"
            class="w-full flex gap-2 p-2 items-stretch font-gothic bg-darkred-dark_gray rounded-lg text-darkred-light md:hover:cursor-pointer">

            <CursorArrowRippleIcon class="w-4 h-4 shrink-0 mt-1 text-darkred-light_gray" />

            <div class="flex-1 flex flex-col gap-1 min-w-0">

                <div v-if="props.perk.type" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                        :style="{ color: props.perk.type.color }">{{ props.perk.type.name }}</sup></div>

                <div v-else class="p2 text-clip">Назва: {{ props.perk.name }}</div>

                <div v-if="props.perk.description" class="p2 text-clip">Опис: {{ props.perk.description }}</div>

                <div v-if="owned && props.perk.levels?.[props.perk.count - 1]" class="p2 text-clip">
                    Поточний рівень ({{ props.perk.count }}/{{ maxLevel }}): {{ props.perk.levels[props.perk.count -
                        1].name }}
                </div>

                <div v-else-if="canLevelUp && props.perk.levels?.[props.perk.count]"
                    class="p2 text-clip text-darkred-light_gray">
                    Наступний рівень: {{ props.perk.levels[props.perk.count].name }}
                </div>

            </div>

            <div class="flex flex-col items-center justify-center gap-1 shrink-0">

                <button @click.stop="props.callback_level_up(props.perk)" :disabled="!canLevelUp" :class="canLevelUp
                    ? 'text-greenish-mid md:hover:cursor-pointer'
                    : 'text-darkred-gray/30 cursor-not-allowed'">
                    <ChevronUpIcon class="w-6 h-6" />
                </button>

                <button @click.stop="props.callback_level_down(props.perk)" :disabled="!canLevelDown" :class="canLevelDown
                    ? 'text-darkred-bright md:hover:cursor-pointer'
                    : 'text-darkred-gray/30 cursor-not-allowed'">
                    <ChevronDownIcon class="w-6 h-6" />
                </button>

                <button v-if="owned" @click.stop="props.callback_remove(props.perk)"
                    class="mt-1 w-6 h-6 flex items-center justify-center rounded-md border border-darkred-red text-darkred-red text-xs leading-none select-none md:hover:bg-darkred-red md:hover:text-darkred-light md:hover:cursor-pointer">
                    ✕
                </button>

            </div>

        </div>

        <PerkModal v-if="!modalHidden" :perk="props.perk" :callback_close="() => modalHidden = true" />

    </div>

</template>
