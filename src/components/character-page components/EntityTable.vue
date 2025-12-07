<script setup>
import { ref } from 'vue';
import { ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon, } from '@heroicons/vue/24/solid'
import ButtonRedHideFunction from '../reusable/Buttons/ButtonRedHideFunction.vue';
import EntityRowView from './EntityRows/EntityRowView.vue';
import SearchArrayByNameViewFunctionality from '../reusable/SearchArrayByNameViewFunctionality.vue';
import SearchArrayByNameWithAddFunctionality from '../reusable/SearchArrayByNameWithAddFunctionality.vue';
import { addRow, removeRow } from '/utils/entityHelper';

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
        icon: type.icon
    }
})


function addEntity(entity) {
    addRow(props.session_entities, props.character_entities, entity.id)
    props.callback()
}

function removeEntity(entity){
    removeRow(props.character_entities, entity.id)
    props.callback()
}

</script>

<template>
    <section v-for="type in types" class="w-full flex flex-col gap-2 items-center justify-center">
        <ButtonRedHideFunction class="w-full" @click="type.hidden = !type.hidden" :text="type.name" :mainIcon="BeakerIcon"
            :hidden="type.hidden" />
        <EntityRowView v-if="!type.hidden" v-for="entity in props.character_entities.filter(entity => entity.type === type.name)" :entity="entity"
            :callback_add="addEntity" :callback_remove="removeEntity" />
    </section>
</template>