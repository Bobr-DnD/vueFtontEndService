<script setup>
import CloseButtonRedBG from '@/components/reusable/Buttons/CloseButtonRedBG.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';

const props = defineProps({
    entity: {
        type: Object,
        required: true
    },
    callback_add: {
        type: Function,
        required: true
    },
    callback_delete: {
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
    <div @click="callback_close"
        class="fixed inset-0 flex items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer">
        <div @click.stop
            class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

            <CloseButtonRedBG @click="callback_close" />

            <div class="font-bold text-2xl text-center border-b border-darkred-red pb-2">
                {{ entity.name }}
            </div>

            <div v-if="props.entity.image">
                <img class="w-full h-40 object-cover border-4 border-darkred-bright rounded-lg shadow-lg"
                    :src="props.entity.image" alt="Entity image" />
            </div>

            <div v-if="props.entity.description" class="justify-self-start">
                Опис: {{ props.entity.description }}
            </div>

            <div v-if="props.entity.characteristics" class="w-full flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Характеристики: </div>

                <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                    <div v-for="value, name in props.entity.characteristics"
                        class="py-1 px-2 rounded-lg even:bg-darkred-light_gray ">
                        {{ name }}: {{ value }}
                    </div>
                </div>

            </div>

            <div v-if="props.entity.requirement" class="w-full flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Вимоги: </div>

                <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                    <div v-for="value, name in props.entity.requirement"
                        class="py-1 px-2 rounded-lg even:bg-darkred-light_gray ">
                        {{ name }}: {{ value }}
                    </div>
                </div>

            </div>

            <div v-if="props.entity.effects.length > 0" class="w-full flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Ефекти: </div>

                <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                    <div class="grid grid-cols-2 py-1 px-2 rounded-lg bg-darkred-light">
                        <div>Назва</div>
                        <div>Опис</div>
                    </div>

                    <div v-for="value in props.entity.effects"
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

            <div class="p-1 w-full rounded-lg bg-darkred-light text-darkred-dark flex-col flex-wrap gap-1">

                <div v-if="props.entity.price"
                    class="rounded-lg odd:bg-darkred-light even:bg-darkred-light_gray py-1 px-2">
                    Ціна: {{ props.entity.price }}
                </div>

                <div v-if="props.entity.rarity"
                    class="rounded-lg odd:bg-darkred-light even:bg-darkred-light_gray py-1 px-2">
                    Рідкість: {{ props.entity.rarity }}
                </div>

                <div v-if="props.entity.usage"
                    class="rounded-lg odd:bg-darkred-light even:bg-darkred-light_gray py-1 px-2">
                    К-сть використань: {{ props.entity.usage }}
                </div>

            </div>

            <div class="p-1 w-full grid grid-cols-2 gap-2 rounded-lg">
                <AprroveButtonWithText text="Додати" @click="props.callback_add(entity); props.callback_close()" />
                <RejectButtonWithText text="Видалити" @click="props.callback_delete(entity); props.callback_close()" />
            </div>


        </div>
    </div>
</template>