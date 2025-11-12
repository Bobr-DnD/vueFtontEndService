<script setup>
import { ref, watch } from 'vue';
import { addRow, removeRow } from '/utils/entityHelper'
import SearchArrayByName from '../reusable/SearchArrayByName.vue';
import DeleteButton from '../reusable/Buttons/DeleteButton.vue';
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue';
import CloseRedButtonNoBG from '../reusable/Buttons/CloseButtonGrayNoBG.vue';

const props = defineProps({
    perks_all: {
        type: Array,
        required: true
    },
    perks: {
        type: Array,
        required: true
    },
    perkPoints: {
        type: Number,
        required: true
    },
    callback: {
        type: Function,
        required: true
    },
    removable: {
        type: Boolean,
        default: false
    }
})

let modal_hidden = ref(true)

watch(() => props.perks, () => {
    modal_hidden.value = true
})

function addPerk(perk) {
    addRow(props.perks_all, props.perks, perk.id);
    props.callback();

}

function removePerk(perk) {
    removeRow(props.perks, perk.id)
    props.callback()
}

</script>
<!-- TODO REFACTOR -->
<template>
    <div v-for="perk, index in props.perks" class="grid grid-cols-[1fr_44px] p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2"
        :id="'Perk' + `${index + 1}`">

        <div v-if="perk.type === 'perk'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-greenish-mid">Перк</sup></div>
        <div v-if="perk.type === 'antiperk'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-darkred-bright">Антиперк</sup></div>
        <div v-if="perk.type === 'status'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-orange-gold">Статус</sup></div>
        <div v-if="perk.type === 'skill'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-orange-orange">Навичка</sup></div>

        <DeleteButton :disabled="!props.removable"
            :class="!props.removable ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
            class="flex justify-center row-span-2 h-min-full h-max-12 self-center items-center text-xl w-11"
            @click="removePerk(perk)" />

        <div class="p2 text-clip">Ефект: {{ perk.effect.description }}</div>

    </div>

    <ModalOpenButton @click="modal_hidden = !modal_hidden" class="justify-self-center" text="Додати перк" />

    <div v-if="!modal_hidden" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-[90%] max-w-lg bg-darkred-dark_gray border border-darkred-dark rounded-2xl shadow-xl p-6
            font-univers transition-all duration-300
           sm:w-[80%] md:w-[60%] lg:w-[40%]">

            <CloseRedButtonNoBG @click="modal_hidden = true" />

            <h2 class="text-xl font-gothic text-center mb-4 border-b text-darkred-light border-darkred-dark pb-2">
                Вибір перку
            </h2>

            <SearchArrayByName :array="perks_all" label="перку" :callback="addPerk" />
        </div>
    </div>

</template>