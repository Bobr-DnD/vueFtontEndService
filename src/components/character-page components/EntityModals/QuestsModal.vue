<script setup>
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';

const props = defineProps({
    quests: {
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
</script>

<template>
    <div @click="props.callback_close"
        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">
        <div @click.stop
            class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic text-lg md:hover:cursor-default">

            <CloseButtonRedBG @click="props.callback_close" />

            <div class="h-6"></div>

            <div class="grid grid-cols-[1fr_1fr_40px]">
                <div>
                    Назва
                </div>
                <div>
                    Опис
                </div>
            </div>

            <div v-for="quest in props.quests"
                class="p-2 rounded-lg bg-darkred-gray odd:bg-darkred-light_gray text-darkred-dark grid grid-cols-[1fr_1fr_40px] gap-2">
                <div>
                    {{ quest.name }}
                </div>
                <div>
                    {{ quest.description }}
                </div>
                <ApproveButton @click="props.callback(quest.id)" />
            </div>

        </div>
    </div>
</template>