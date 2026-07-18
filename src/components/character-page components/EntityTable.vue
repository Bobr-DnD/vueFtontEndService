<script setup>
import { ref, watch, computed } from 'vue';
import { addRow, removeRow } from '/utils/entityHelper';
import { notify } from '/utils/notification';
import { groupById } from '/utils/entityHelper';

import ButtonRedHideFunction from '../reusable/Buttons/ButtonRedHideFunction.vue';
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue';
import ApproveButton from '../reusable/Buttons/ApproveButton.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import EntityRowView from './EntityRows/EntityRowView.vue';
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue';
import SearchInputBlack from '../reusable/SearchInputs/SearchInputBlack.vue';


const props = defineProps({
    character_entities: {
        type: Array,
        required: true
    },
    session_entities: {
        type: Array,
        required: true
    },
    types: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

const types = ref([])

watch(() => props.types, (newTypes) => {
    types.value = newTypes.map(type => ({
        name: type.name,
        id: type.id,
        hidden: true,
        icon: type.icon,
        search: '',
        modal_hidden: true,
        searchGlobal: ''
    }))
}, { immediate: true })

const groupedCharacterEntities = computed(() => {
    return groupById(props.character_entities)
})

function addEntity(entity) {
    addRow(props.session_entities, props.character_entities, entity.id)
    notify({ message: `Додано ${entity.name}`, type: 'success' })
    props.callback()
}

function removeEntity(entity) {
    removeRow(props.character_entities, entity.id)
    notify({ message: `Видалено ${entity.name}`, type: 'success' })
    props.callback()
}

function getFilteredCharacterEntities(type) {
    return groupedCharacterEntities.value
        .filter(e => e.type === type.id)
        .filter(e =>
            e.name.toLowerCase().includes(type.search.toLowerCase())
        )
}

function getFilteredSessionEntities(type) {
    return props.session_entities
        .filter(e => e.type === type.id)
        .filter(e =>
            e.name.toLowerCase().includes(type.searchGlobal.toLowerCase())
        )
}

</script>

<template>

    <section v-for="type in types" :key="type.id" class="w-full flex flex-col gap-1 items-center justify-center">
        <ButtonRedHideFunction class="w-full" @click="type.hidden = !type.hidden" :text="type.name"
            :mainIcon="type.icon" :hidden="type.hidden" />

        <div v-if="!type.hidden" class="w-full flex gap-2 font-gothic">
            <SearchInputBlack class="w-full" v-model:searchQuery="type.search" />
        </div>


        <div class="w-full max-h-[680px] overflow-y-auto auto-hide-scroll flex flex-col gap-1">
            <EntityRowView v-if="!type.hidden" v-for="entity in getFilteredCharacterEntities(type)" :key="entity.name"
                :entity="entity" :callback_add="addEntity" :callback_remove="removeEntity" />
        </div>

        <div v-if="!type.hidden" class="w-full flex justify-center items-center">
            <ModalOpenButton @click="type.modal_hidden = !type.modal_hidden" class="justify-self-center"
                text="Додати" />
        </div>

        <div v-if="!type.modal_hidden" @click="type.modal_hidden = true"
            class="w-full p-2 fixed inset-0 flex flex-col gap-1 items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer text-darkred-light">

            <div @click.stop
                class="max-w-[480px] max-h-[680px] h-90% w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

                <CloseButtonRedBG @click="type.modal_hidden = true" />

                <div v-if="!type.hidden" class="w-[85%] flex gap-2">
                    <SearchInputBlack class="w-full" v-model:searchQuery="type.searchGlobal" />

                </div>

                <div class="w-[450px] grid grid-cols-[1fr_100px_64px] px-2 text-xl font-univers">
                    <div>
                        Назва
                    </div>
                    <div class="justify-self-center">
                        Ціна
                    </div>
                </div>

                <div class="max-h-[680px] overflow-y-auto auto-hide-scroll flex flex-col gap-2">
                    <div v-for="entity in getFilteredSessionEntities(type)" :key="entity.name"
                        class="grid grid-cols-[1fr_100px_64px] items-center px-2 py-1 rounded-lg font-univers text-lg odd:bg-darkred-gray">
                        <div>
                            {{ entity.name }}
                        </div>
                        <div class="justify-self-center">{{ entity.price }}</div>
                        <ApproveButton @click="addEntity(entity)" class="w-16" />
                    </div>
                </div>

            </div>

        </div>

    </section>
</template>