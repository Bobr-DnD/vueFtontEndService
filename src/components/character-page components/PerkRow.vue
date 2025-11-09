<script setup>
import { addRow } from '/utils/entityHelper'

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

    <select v-if="props.perkPoints > 0" name="Perk" id="Perk" @change="addItem($event)" :class="['min-w-fit w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Додати перк</option>

        <option v-if="props.perkPoints != 0" v-for="perk in props.perks_all" :value="perk.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ perk.name }}{{ perk.type === 'skill' ? ' (Навичка)' : '' }}{{ perk.type === 'status' ? ' (Статус)' : ''
            }}{{ perk.type === 'perk' ? ' (Перк)' : '' }} </option>

    </select>

</template>