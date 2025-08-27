<script setup>
const medicines = defineModel('medicines', { type: Array, required: true })
const props = defineProps({
    medicines_all: {
        type: Array,
        required: true
    }
})

function deleteRow(index) {
    medicines.value.splice(index, 1)
}
function addRow() {
    const meds_one = props.medicines_all.filter(w => w.id === event.target.value)[0]
    medicines.value.push(meds_one)
    event.target.value = 'default'
}
</script>

<template>
    <div v-for="med, index in medicines" class="grid grid-cols-[1fr_1fr_1fr_1fr_30px] p-2 gap-2 items-center justify-items-center 
            bg-darkred-gray border-2 border-darkred-red rounded-lg text-darkred-dark text-sm font-medium my-2"
        :id="'Weapon' + `${index + 1}`">
        <div class="col-span-4 p2 text-clip ">{{ med.name }}</div>
        <div @click="deleteRow(index)"
            class="row-span-2 p-2 text-clip w-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer">
            X</div>
    </div>
    <select name="Medicines" id="Medicines" @change="addRow" :class="['min-w-fit max-w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center']">
        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть медикамент</option>
        <option v-for="med in props.medicines_all" :value="med.id"
            class="bg-darkred-dark text-darkred-bright text-clip">
            {{ med.name }} </option>
    </select>
</template>