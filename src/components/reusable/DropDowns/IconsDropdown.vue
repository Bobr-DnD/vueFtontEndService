<script setup>
import { computed, ref } from 'vue'
import { iconsList, iconsCategories, iconsCategoryLabels, returnIcon } from '@utils/icons'
import CloseButtonBackground from '../Buttons/CloseButtonBackground.vue'

const props = defineProps({
    icon: {
        type: String,
        default: 'checkBadge'
    },
    field_id: {
        type: String,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const icon_local = ref(returnIcon(structuredClone(props.icon)))
const open = ref(false)

const iconsByCategory = computed(() =>
    iconsCategories
        .map(category => ({
            category,
            label: iconsCategoryLabels[category] ?? category,
            icons: iconsList.filter(icon => icon.category === category)
        }))
        .filter(group => group.icons.length)
)

function selectOption(id) {
    icon_local.value = returnIcon(id)
    open.value = false
    props.callback(props.field_id, id)
}

</script>

<template>
    <div class="relative w-full">
        <button @click="open = !open" class="w-full flex items-center gap-2 px-3 py-2 border border-brand-base rounded-md
             bg-brand-surface text-brand-text hover:bg-brand-base transition">

            <component class="w-10 h-10" :is="icon_local.icon" />

            <span>
                Змінити
            </span>

        </button>

        <div v-if="open" @click="open = false"
            class="fixed inset-0 flex items-center justify-center z-50 bg-brand-base/50 md:hover:cursor-pointer">
            <div @click.stop
                class="max-w-[468px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-brand-base bg-brand-surface text-brand-text shadow-xl space-y-2 relative font-gothic md:hover:cursor-default max-h-[80vh] overflow-y-scroll no-scrollbar">

                <div class="w-full h-8">
                    <CloseButtonBackground @click="open = false" />
                </div>

                <div v-for="group in iconsByCategory" :key="group.category" class="w-full">
                    <p class="text-sm uppercase tracking-wide text-brand-text/70 mb-2">
                        {{ group.label }}
                    </p>

                    <div class="flex flex-wrap gap-4">
                        <button v-for="icon in group.icons" :key="icon.id" @click="selectOption(icon.id)">

                            <component :is="icon.icon" class="w-12 h-12 p-2 border-2 rounded-lg border-brand-muted" />

                        </button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>
