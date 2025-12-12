<script setup>
import { ref } from 'vue';
import ButtonRedHideFunction from '../reusable/Buttons/ButtonRedHideFunction.vue';
import CloseButtonRedBG from '../reusable/Buttons/CloseButtonRedBG.vue';
import ApproveButton from '../reusable/Buttons/ApproveButton.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import EntityRowView from './EntityRows/EntityRowView.vue';
import ModalOpenButton from '../reusable/Buttons/ModalOpenButton.vue';
import { addRow, removeRow } from '/utils/entityHelper';
import { returnIcon } from '@utils/icons';
import { notify } from '/utils/notification';

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

types.value = props.types.map(type => {
    return {
        name: type.name,
        id: type.id,
        hidden: true,
        icon: type.icon,
        search: '',
        modal_hidden: true,
        searchGlobal: ''
    }
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
    return props.character_entities
        .filter(e => e.type === type.name)
        .filter(e =>
            e.name.toLowerCase().includes(type.search.toLowerCase())
        )
}

function getFilteredSessionEntities(type) {
    return props.session_entities
        .filter(e => e.type === type.name)
        .filter(e =>
            e.name.toLowerCase().includes(type.searchGlobal.toLowerCase())
        )
}

</script>

<template>

    <section v-for="type in types" :key="Math.random().toString(24).slice(2)" class="w-full flex flex-col gap-1 items-center justify-center">
        <ButtonRedHideFunction class="w-full" @click="type.hidden = !type.hidden" :text="type.name"
            :mainIcon="type.icon" :hidden="type.hidden" />

        <div v-if="!type.hidden" class="w-full flex gap-2 font-gothic">
            <input v-model="type.search" placeholder="Пошук ..."
                class="h-12 w-full p-2 rounded-lg bg-darkred-dark_gray text-darkred-light" />

            <RejectButtonWithText v-if="type.search" @click="type.search=''" text="Очистити" />
        </div>


        <div class="w-full max-h-[680px] overflow-y-scroll no-scrollbar flex flex-col gap-1">
            <EntityRowView v-if="!type.hidden" v-for="entity in getFilteredCharacterEntities(type)" :key="entity.name" :entity="entity"
                :callback_add="addEntity" :callback_remove="removeEntity" />
        </div>

        <div v-if="!type.hidden" class="w-full flex justify-center items-center">
            <ModalOpenButton @click="type.modal_hidden = !type.modal_hidden" class="justify-self-center"
                text="Додати" />
        </div>

        <div v-if="!type.modal_hidden" @click="type.modal_hidden = true"
            class="w-full p-2 fixed inset-0 flex flex-col gap-1 items-center justify-center z-50 bg-darkred-dark/50 md:hover:cursor-pointer text-darkred-light">

            <div @click.stop
                class="max-w-[480px] w-full mx-2 p-2 grid grid-cols-1 gap-2 rounded-xl border-2 border-darkred-dark bg-darkred-dark_gray text-darkred-light shadow-xl space-y-2 relative font-gothic md:hover:cursor-default">

                <CloseButtonRedBG @click="type.modal_hidden = true" />

                <div v-if="!type.hidden" class="w-[90%] flex gap-2">
                    <input v-model="type.searchGlobal" placeholder="Пошук ..."
                        class="h-12 w-full p-2 rounded-lg bg-darkred-light text-darkred-dark placeholder:text-darkred-dark_gray font-gothic" />

                    <RejectButtonWithText v-if="type.searchGlobal" @click="type.searchGlobal=''" text="Очистити" />

                </div>

                <div class="grid grid-cols-[1fr_100px_64px] px-2 text-xl font-univers">
                    <div>
                        Назва
                    </div>
                    <div>
                        Ціна
                    </div>
                </div>

                <div v-for="entity in getFilteredSessionEntities(type)" :key="entity.name"
                    class="grid grid-cols-[1fr_100px_64px] items-center px-2 py-1 rounded-lg font-univers text-lg odd:bg-darkred-gray">
                    <div>
                        {{ entity.name }}
                    </div>
                    <div>{{ entity.price }}</div>
                    <ApproveButton @click="addEntity(entity)" class="w-16" />
                </div>
            </div>

        </div>

    </section>
</template>