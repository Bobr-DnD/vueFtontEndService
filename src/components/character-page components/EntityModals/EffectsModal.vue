<script setup>
import { ref, computed, toRaw } from 'vue';
import { checkObjectFieldExisting } from '@utils/entityHelper';

import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';


const props = defineProps({
    effects: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    },
    callback_close: {
        type: Function,
        required: true
    }
})

const searchQuery = ref('')

const filteredEffects = computed(() => {

    if (!searchQuery.value.trim()) return toRaw(props.effects)
    const query = searchQuery.value.toLowerCase()
    return toRaw(props.effects.filter(el =>
        el.name.toLowerCase().includes(query)
    ))
})

</script>

<template>
    <div @click="props.callback_close"
        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">
        <div @click.stop
            class="w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic text-lg md:hover:cursor-default">

            <CloseButtonRedBG @click="props.callback_close" />
            <div class="h-6"></div>

            <div class="p-2 grid grid-cols-[140px_1fr_40px] gap-2 bg-darkred-dark rounded-lg">
                <div>
                    Назва
                </div>
                <div class="justify-self-center">
                    Опис
                </div>
            </div>

            <div>
                <SearchInputBlack v-model:searchQuery="searchQuery" />
            </div>

            <div class="max-h-[650px] overflow-y-scroll grid grid-cols-1 gap-2">
                <div v-for="effect in filteredEffects" :key="effect.id"
                    class="p-2 rounded-lg bg-darkred-gray odd:bg-darkred-light_gray text-darkred-dark grid grid-cols-[140px_1fr_40px] gap-2 items-center">

                    <div>{{ effect.name }}</div>

                    <div class="justify-self-center">{{ effect.description }}</div>

                    <ApproveButton class="row-span-2 flex justify-center items-center"
                        @click="props.callback(effect.id)" />

                    <div v-if="checkObjectFieldExisting(effect.effect)"
                        class="col-span-2 justify-self-start flex flex-wrap gap-1 items-center">
                        <div class="shrink w-full text-xl font-medium">
                            Еффекти:
                        </div>
                        <div v-if="effect.effect" v-for="value, name in effect.effect"
                            :key="Math.random().toString(24).slice(2)"
                            class="bg-darkred-dark_gray text-darkred-light p-2 rounded-lg font-normal">
                            {{ name }}: {{ value }}
                        </div>
                    </div>


                </div>
            </div>



        </div>
    </div>
</template>