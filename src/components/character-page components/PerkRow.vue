<script setup>
import { addRow } from '/utils/entityHelper'
import SearchArrayByName from '../reusable/SearchArrayByName.vue';

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
    }
})

function addItem(event) {
    addRow(props.perks_all, props.perks, event.target.value);
    props.callback();
    event.target.value = 'default';
}
</script>
<!-- TODO REFACTOR -->
<template>
    <div v-for="perk, index in props.perks" class="grid grid-cols-1 p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2"
        :id="'Perk' + `${index + 1}`">

        <div v-if="perk.type === 'perk'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-greenish-mid">Перк</sup></div>
        <div v-if="perk.type === 'status'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-orange-gold">Статус</sup></div>
        <div v-if="perk.type === 'skill'" class="p2 text-clip">Назва: {{ perk.name }} <sup
                class="text-orange-orange">Навичка</sup></div>

        <div class="p2 text-clip">Ефект: {{ perk.effect.description }}</div>

    </div>

    <button>Додати Перк</button>


    <SearchArrayByName :array="perks_all"/>

</template>