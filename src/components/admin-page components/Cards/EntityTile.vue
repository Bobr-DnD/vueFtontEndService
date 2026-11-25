<script setup>
import { DocumentDuplicateIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    entity: {
        type: Object,
        required: true
    },
    callback_copy: {
        type: Function,
        default: () => console.log('Button is inactive, nothing to copy to')
    }
})

</script>

<template>
    <div class="p-3 rounded-2xl bg-brand-base text-brand-text flex flex-col gap-2 cursor-pointer">

        <div class="flex items-center justify-between gap-2">

            <div class="text-xl font-medium">
                {{ props.entity.name }}
            </div>

            <button @click.stop="props.callback_copy(props.entity.id)" title="Копіювати"
                class="p-1.5 rounded-lg shrink-0 bg-brand-surface text-brand-text md:hover:bg-brand-muted md:hover:cursor-pointer">
                <DocumentDuplicateIcon class="w-4 h-4" />
            </button>

        </div>

        <div v-if="props.entity.description" class="p-2 bg-brand-surface rounded-lg">
            Опис: {{ props.entity.description }}
        </div>

        <div v-else class="p-2 bg-brand-surface rounded-lg">Опис відсутній</div>

    </div>
</template>