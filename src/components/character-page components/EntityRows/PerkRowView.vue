<script setup>
import { ref } from 'vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import PerkModal from '../EntityModals/PerkModal.vue';

const props = defineProps({
    perk: {
        type: Object,
        required: true
    },
    callback: {
        type: Function,
        required: false,
        default: () => { console.log('Button is inactive, How tf did you clicked that?!') }
    },
    removable: {
        type: Boolean,
        required: false
    }
})

const modalHidden = ref(true)

</script>

<template>
    <div>

        <div @click="modalHidden = !modalHidden"
            class="w-full grid p-2 gap-2 items-center justify-items-start font-gothic bg-darkred-dark_gray rounded-lg text-darkred-light md:hover:cursor-pointer">

            <div v-if="props.perk.type" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                    :style="{ color: props.perk.type.color }">{{ props.perk.type.name }}</sup></div>

            <div v-else class="p2 text-clip">Назва: {{ props.perk.name }}</div>

            <DeleteButton v-if="!props.removable" :disabled="!props.removable"
                :class="!props.removable ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
                class="flex justify-center row-span-2 h-min-full h-max-12 self-center items-center text-xl w-11"
                @click="props.callback(props.perk)" />

            <div class="p2 text-clip">Опис: {{ props.perk.descriptions[props.perk.count - 1 ] }}</div>

        </div>

        <PerkModal v-if="!modalHidden" :perk="props.perk" :callback_close="() => modalHidden = true"/>

    </div>

</template>