<script setup>
import { ref } from 'vue';
import { checkObjectFieldExisting } from '/utils/entityHelper';

import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';
import PerkModal from '../EntityModals/PerkModal.vue';
import { CursorArrowRippleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    perk: {
        type: Object,
        required: true
    },
    callback_remove: {
        type: Function,
        required: false,
        default: () => { console.log('Button is inactive, How tf did you clicked that?!') }
    },
    callback_add: {
        type: Function,
        required: false,
        default: () => { console.log('Button is inactive, you cant add anything)') }
    },
    removable: {
        type: Boolean,
        default: false
    },
    addable: {
        type: Boolean,
        default: false
    }
})

const modalHidden = ref(true)

</script>

<template>
    <div class="relative">

        <CursorArrowRippleIcon class="w-5 h-5 absolute top-2 right-1 text-darkred-light" />

        <div @click="modalHidden = !modalHidden" :class="[
            props.removable || props.addable ? 'grid-cols-[1fr_50px]' : 'grid-cols-1',
            props.removable ? 'border-l-4 border-greenish-mid' : '',
            props.addable ? 'border-l-4 border-darkred-gray' : ''
        ]"
            class="w-full grid p-2 gap-2 items-center justify-items-start font-gothic bg-darkred-dark_gray rounded-lg text-darkred-light md:hover:cursor-pointer">

            <div v-if="props.perk.type" class="p2 text-clip">Назва: {{ props.perk.name }} <sup
                    :style="{ color: props.perk.type.color }">{{ props.perk.type.name }}</sup></div>

            <div v-else class="p2 text-clip">Назва: {{ props.perk.name }}</div>

            <DeleteButton v-if="props.removable" @click.stop @click="props.callback_remove(props.perk)"
                class="flex justify-center items-center justify-self-center row-span-2 bg-darkred-red text-xl w-11" />

            <ApproveButton v-if="props.addable" @click.stop @click="props.callback_add(props.perk)"
                class="row-span-2 w-11 justify-self-center" />

            <div class="p2 text-clip">Опис: {{ props.perk.description }}</div>
            
            <div v-if="props.perk.count && props.perk.ranks > 0 && props.perk.levels?.[props.perk.count - 1]"
                class="p2 text-clip">{{ props.perk.levels[props.perk.count - 1].name }}
            </div>

        </div>

        <PerkModal v-if="!modalHidden" :perk="props.perk" :callback_close="() => modalHidden = true" />

    </div>

</template>