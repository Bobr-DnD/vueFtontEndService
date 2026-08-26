<script setup>
import { ref, watch, computed } from 'vue';
import { addRow, removeRow, removeAllRows, filterPerksByRank, groupById } from '/utils/entityHelper'
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue';
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue';
import ApproveButton from '../reusable/Buttons/ApproveButton.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import ButtonRedHideFunction from '../reusable/Buttons/ButtonRedHideFunction.vue';
import PerkRowView from './EntityRows/PerkRowView.vue';

const props = defineProps({
    session_perks: {
        type: Array,
        required: true
    },
    character_perks: {
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

const modalHidden = ref(true)
const perksHidden = ref(true)
const characterPerksSearchQuery = ref('')
const sessionPerksSearchQuery = ref('')

watch(() => props.character_perks, () => {
    modalHidden.value = true //NOTE responsible for autoclosing of a modal, I can forget that shit
    filterPerksByRank(props.character_perks, props.session_perks)
})

const filteredCharacterArray = computed(() => {
    const groupedArray = groupById(props.character_perks)

    if (!characterPerksSearchQuery.value.trim()) return groupedArray
    const query = characterPerksSearchQuery.value.toLowerCase()
    return groupedArray.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

const filteredSessionArray = computed(() => {
    const filteredArray = filterPerksByRank(props.character_perks, props.session_perks)

    if (!sessionPerksSearchQuery.value.trim()) return filteredArray
    const query = sessionPerksSearchQuery.value.toLowerCase()
    return filteredArray.filter(el =>
        el.name.toLowerCase().includes(query)
    )
})

function levelUpPerk(perk) {
    const maxLevel = perk.levels?.length || 1
    if (perk.count >= maxLevel) return
    addRow(props.session_perks, props.character_perks, perk.id);
    props.callback();
}

function levelDownPerk(perk) {
    if (!perk.count) return
    removeRow(props.character_perks, perk.id)
    props.callback()
}

function removePerkFully(perk) {
    removeAllRows(props.character_perks, perk.id)
    props.callback()
}

</script>

<template>

    <div class="w-full space-y-1 font-gothic">

        <ButtonRedHideFunction class="w-full" @click="perksHidden = !perksHidden" text="Перки" mainIcon="checkBadge"
            :hidden="perksHidden" />

        <div v-if="!perksHidden" class="w-full flex gap-2">
            <input v-model="characterPerksSearchQuery" placeholder="Пошук ..."
                class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

            <RejectButtonWithText v-if="characterPerksSearchQuery" @click="characterPerksSearchQuery = ''"
                text="Очистити" />
        </div>

        <div v-if="!perksHidden" class="w-full max-h-[680px] overflow-y-auto auto-hide-scroll flex flex-col gap-1">
            <PerkRowView v-for="perk in filteredCharacterArray" :key="perk.id" :perk="perk"
                :callback_level_up="levelUpPerk" :callback_level_down="levelDownPerk"
                :callback_remove="removePerkFully" />

        </div>

        <div v-if="!perksHidden && props.perkPoints > 0" class="w-full flex justify-center">
            <ModalOpenButton @click="modalHidden = false" class="mx-auto" text="Додати перк" />
        </div>


        <div v-if="!modalHidden" @click="modalHidden = true"
            class="w-full p-2 modal-overlay flex flex-col gap-1 items-center justify-center md:hover:cursor-pointer text-darkred-light">

            <div @click.stop
                class="max-w-[480px] max-h-[680px] h-90% w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

                <CloseButtonRedBG @click="modalHidden = true" />

                <div v-if="!perksHidden" class="w-[85%] flex gap-2">
                    <input v-model="sessionPerksSearchQuery" placeholder="Пошук ..."
                        class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

                    <RejectButtonWithText v-if="sessionPerksSearchQuery" @click="sessionPerksSearchQuery = ''"
                        text="Очистити" />
                </div>

                <div class="max-h-[680px] overflow-y-auto auto-hide-scroll">
                    <div v-for="perk in filteredSessionArray" :key="perk.id"
                        class="grid grid-cols-[1fr_40px] gap-2 odd:bg-darkred-gray p-2 rounded-lg">
                        <div>Назва: {{ perk.name }}</div>

                        <ApproveButton @click="levelUpPerk(perk)" class="row-span-2 flex justify-center items-center" />

                        <div v-if="perk.description.length">Опис: {{ perk.description }}</div>

                    </div>
                </div>


            </div>

        </div>

    </div>

</template>