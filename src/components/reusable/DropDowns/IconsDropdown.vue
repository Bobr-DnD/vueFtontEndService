<script setup>
import { computed, ref } from 'vue'
import { iconsList, iconsCategories, iconsCategoryLabels, returnIcon } from '@utils/icons'
import CloseButtonRedBG from '../Buttons/CloseButtonRedBG.vue'

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
        <button @click="open = !open" class="w-full flex items-center gap-2 px-3 py-2 border border-darkred-dark rounded-md
             bg-darkred-dark_gray text-darkred-light hover:bg-darkred-dark transition">

            <component :is="icon_local.icon" />

            <span>
                Змінити
            </span>

        </button>

        <div v-if="open" @click="open = false"
            class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">
            <div @click.stop
                class="max-w-[468px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default max-h-[80vh] overflow-y-scroll no-scrollbar">

                <div class="w-full h-8">
                    <CloseButtonRedBG @click="open = false" />
                </div>

                <div v-for="group in iconsByCategory" :key="group.category" class="w-full">
                    <p class="text-sm uppercase tracking-wide text-darkred-light/70 mb-2">
                        {{ group.label }}
                    </p>

                    <div class="flex flex-wrap gap-4">
                        <div v-for="icon in group.icons" :key="icon.id" @click="selectOption(icon.id)"
                            class="md:hover:cursor-pointer">

                            <component :is="icon.icon" class="w-12 h-12 p-2 border-2 rounded-lg border-darkred-gray" />

                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>
