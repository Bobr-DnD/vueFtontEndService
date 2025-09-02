<script setup>
const perks = defineModel('perks', { type: Array, required: true })
const perkPoints = defineModel('perkPoints', {type: Number, required:true})
const props = defineProps({
    perks_all: {
        type: Array,
        required: true
    }
})

function addRow() {
    const perk_one = props.perks_all.find(w => w.id === event.target.value)
    perks.value.push(perk_one)
    event.target.value = 'default'
    perkPoints.value--;
}
</script>

<template>
    <div v-for="perk, index in perks"
        class="grid grid-cols-1 p-2 gap-2 items-center justify-items-start font-gothic
            bg-darkred-dark_gray border-2 border-darkred-red rounded-lg text-darkred-light text-sm font-medium my-2"
        :id="'Perk' + `${index + 1}`">

        <div class="p2 text-clip">Назва: {{ perk.name }}</div>

        <div class="p2 text-clip">Ефект: {{ perk.effect.description }}</div>

    </div>

        <select v-if="perkPoints > 0" name="Perk" id="Perk" @change="addRow" :class="['min-w-fit w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center font-semibold text-lg']">

        <option value="default" class="bg-darkred-dark text-darkred-bright">Додати перк</option>

        <option v-for="perk in props.perks_all" :value="perk.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ perk.name }} </option>

    </select>

</template>