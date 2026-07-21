<script setup>
import { ref, watch } from 'vue'
import CloseButtonRedBG from './Buttons/CloseButtonRedBG.vue';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid';
import Header2 from './Titles/Header2.vue';

const props = defineProps({
    side: {
        type: String,
        default: 'right',
        validator: (value) => ['left', 'right'].includes(value)
    },
    width: {
        type: String,
        default: '320px'
    },
    status: {
        type: Boolean,
        default: false
    },
    charactersIds: {
        type: Array,
        required: true
    },
    charactersOnlineIds: {
        type: Array,
        default: []
    }
})

const isOpen = ref(false)
const characters = ref([])

watch(() => props.charactersOnlineIds, () => setOnlineCharacters())

function setOnlineCharacters() {

    characters.value = props.charactersIds
        .filter(el => props.charactersOnlineIds.includes(el.id))
        .map(el => el.id)

}

</script>

<template>
    <div>

        <button @click="isOpen = !isOpen"
            class="pointer-events-auto fixed top-32 -translate-y-1/2 z-50 bg-darkred-dark text-darkred-light px-3 py-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
            :class="{
                'left-0 rounded-l-none': side === 'left' && !isOpen,
                'left-[calc(var(--panel-width))]': side === 'left' && isOpen,
                'right-0 rounded-r-none': side === 'right' && !isOpen,
                'right-[calc(var(--panel-width))]': side === 'right' && isOpen
            }, isOpen ? 'mx-4' : ''" :style="{ '--panel-width': width }"
            :aria-label="isOpen ? 'Close panel' : 'Open panel'" :aria-expanded="isOpen">

            <ArrowRightIcon v-if="side === 'right'" class="w-5 h-5 transition-transform duration-300" :class="{
                'rotate-0': isOpen,
                'rotate-180': !isOpen
            }" />

            <ArrowLeftIcon v-if="side === 'left'" class="w-5 h-5 transition-transform duration-300" :class="{
                'rotate-0': isOpen,
                'rotate-180': !isOpen,
            }" />

        </button>

        <Transition name="fade">
            <div v-if="isOpen" @click="isOpen = !isOpen"
                class="fixed inset-0 bg-darkred-dark bg-opacity-50 z-40 backdrop-blur-sm pointer-events-auto"
                aria-hidden="true">
            </div>
        </Transition>

        <Transition :name="side === 'left' ? 'slide-left' : 'slide-right'">
            <div v-if="isOpen" class="fixed z-40 bg-darkred-dark shadow-xl rounded-2xl m-2 overflow-y-auto" :class="{
                'left-0': side === 'left',
                'right-0': side === 'right'
            }" :style="{ width: width }">

                <CloseButtonRedBG @click="isOpen = false" class="pointer-events-auto" />

                <div class="p-6 ">

                    <Header2 v-if="props.status" label="Онлайн" class="text-greenish-mid" />
                    <Header2 v-else label="Офлайн" class="text-darkred-bright" />

                </div>

                <div class="px-6 pb-6 pt-2 text-darkred-light font-gothic text-xl flex flex-col gap-2">
                    <div v-for="character in props.charactersIds" :key="character.id"
                        class="[&>*]:w-fit [&>*]:p-1 [&>*]:border-b-2 [&>*]:relative [&>*]:inline-block rounded-lg [&>*]:rounded-lg">

                        <div v-if="characters.includes(character.id)"
                            class="border-greenish-dark">
                            {{ character.name }}
                            <div class="w-4 h-4 border-1 rounded-full bg-greenish-dark absolute -top-2 -right-3"></div>
                        </div>

                        <div v-else class="border-darkred-red">
                            {{ character.name }}
                            <div class="w-4 h-4 border-1 rounded-full bg-darkred-red absolute -top-1 -right-3"></div>
                        </div>

                    </div>
                </div>
            </div>

        </Transition>
    </div>
</template>

<style scoped>
/* Slide animations */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease-out;
}

.slide-right-enter-from {
    transform: translateX(100%);
}

.slide-right-leave-to {
    transform: translateX(100%);
}

.slide-left-enter-from {
    transform: translateX(-100%);
}

.slide-left-leave-to {
    transform: translateX(-100%);
}

/* Fade animation for overlay */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom scrollbar for panel */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #8E1616 #1A130D;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 10px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #1A130D;
    border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #8E1616 0%, #390C06 100%);
    border-radius: 8px;
    border: 2px solid #1A130D;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #b91c1c 0%, #5a1208 100%);
}
</style>