<script setup>
import { ref, watch } from 'vue';
import { addRow, removeRow, sortByTwoFields } from '/utils/entityHelper'
import SearchArrayByNameWithAddFunctionality from '../reusable/SearchArrayByNameWithAddFunctionality.vue';
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue';
import CloseRedButtonNoBG from '../reusable/Buttons/CloseButtonGrayNoBG.vue';
import SearchArrayByNameViewFunctionality from '../reusable/SearchArrayByNameViewFunctionality.vue';

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
    modal_hidden.value = true //NOTE responsible for autoclosing of a modal, I can forget that shit
    sortByTwoFields(props.perks, 'type', 'name')
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

<template>

    <SearchArrayByNameViewFunctionality :array="props.perks" label="перку" :callback="removePerk" type="perk" :perkRemovable="props.removable"/>

    <ModalOpenButton v-if="props.perkPoints > 0" @click="modal_hidden = !modal_hidden" class="justify-self-center" text="Додати перк" />

    <div v-if="!modal_hidden" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-[90%] max-w-lg bg-darkred-dark_gray border border-darkred-dark rounded-2xl shadow-xl p-6
            font-univers transition-all duration-300
           sm:w-[80%] md:w-[60%] lg:w-[40%]">

            <CloseRedButtonNoBG @click="modal_hidden = true" />

            <h2 class="text-xl font-gothic text-center mb-4 border-b text-darkred-light border-darkred-dark pb-2">
                Вибір перку
            </h2>

            <SearchArrayByNameWithAddFunctionality :array="perks_all" label="перку" type="perk" :callback="addPerk" />
        </div>
    </div>

</template>