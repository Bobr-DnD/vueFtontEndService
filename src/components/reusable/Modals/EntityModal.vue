<script setup>
import CloseButtonBackground from '@/components/reusable/Buttons/CloseButtonBackground.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import { checkArrayFieldExisting, checkObjectFieldExisting } from '@utils/entityHelper';

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
        class="fixed inset-0 flex items-center justify-center z-50 bg-brand-base/50 md:hover:cursor-pointer">
        <div @click.stop
            class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-brand-base bg-brand-surface text-brand-text shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

            <CloseButtonBackground @click="callback_close" />

            <div class="font-bold text-2xl text-center border-b border-brand-accent pb-2">
                <div class="w-[90%]">
                    {{ entity.name }}
                </div>

            </div>

            <div v-if="props.entity.image">
                <img class="w-full h-40 object-cover border-4 border-brand-accent-hover rounded-lg shadow-lg"
                    :src="props.entity.image" alt="Entity image" />
            </div>

            <div v-if="props.entity.description" class="px-2 justify-self-start">
                Опис: {{ props.entity.description }}
            </div>

            <div v-if="checkObjectFieldExisting(props.entity.characteristics)" class="w-full flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Характеристики: </div>

                <div class="p-1 w-full bg-brand-surface-inverted rounded-lg text-brand-ink flex flex-col gap-1">
                    <div v-for="value, name in props.entity.characteristics" :key="Math.random().toString(24).slice(2)"
                        class="py-1 px-2 rounded-lg even:bg-brand-subtle ">
                        {{ name }}: {{ value }}
                    </div>
                </div>

            </div>

            <div v-if="props.entity.requirement" class="w-full flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Вимоги: </div>

                <div class="p-1 w-full bg-brand-surface-inverted rounded-lg text-brand-ink flex flex-col gap-1">
                    <div v-for="value, name in props.entity.requirement" :key="Math.random().toString(24).slice(2)"
                        class="py-1 px-2 rounded-lg even:bg-brand-subtle ">
                        {{ name }}: {{ value }}
                    </div>
                </div>

            </div>

            <div v-if="checkArrayFieldExisting(props.entity.effects)" class="w-full flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Ефекти: </div>

                <div class="p-1 w-full bg-brand-surface-inverted rounded-lg text-brand-ink flex flex-col gap-1">
                    <div class="grid grid-cols-2 py-1 px-2 rounded-lg bg-brand-surface-inverted">
                        <div>Назва</div>
                        <div>Опис</div>
                    </div>

                    <div v-for="value in props.entity.effects" :key="value.id"
                        class="py-1 px-2 rounded-lg even:bg-brand-subtle grid grid-cols-2">
                        <div>
                            {{ value.name }}:
                        </div>
                        <div>
                            {{ value.description }}
                        </div>
                    </div>

                </div>

            </div>

            <div v-if="props.entity.price || props.entity.rarity" class="p-1 w-full rounded-lg bg-brand-surface-inverted text-brand-ink flex-col flex-wrap gap-1">

                <div v-if="props.entity.price"
                    class="rounded-lg odd:bg-brand-surface-inverted even:bg-brand-subtle py-1 px-2">
                    Ціна: {{ props.entity.price }}
                </div>

                <div v-if="props.entity.rarity"
                    class="rounded-lg odd:bg-brand-surface-inverted even:bg-brand-subtle py-1 px-2">
                    Рідкість: {{ props.entity.rarity }}
                </div>

            </div>

            <div class="p-1 w-full grid grid-cols-2 gap-2 rounded-lg">
                <AprroveButtonWithText text="Додати" @click="props.callback_add(entity); props.callback_close()" />
                <RejectButtonWithText text="Видалити" @click="props.callback_delete(entity); props.callback_close()" />
            </div>


        </div>
    </div>
</template>