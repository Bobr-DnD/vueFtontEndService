<script setup>
const armors = defineModel('armors', { type: Array, required: true })
const props = defineProps({
    armors_all : {
        type: Array,
        required: true
    }
})

</script>

<template>
        <div v-for="armor, index in armors" class="grid grid-cols-[1fr_1fr_1fr_1fr_30px] grid-rows-2 p-2 gap-2 items-center justify-items-center 
            bg-darkred-gray border-2 border-darkred-red rounded-lg text-darkred-dark text-sm font-medium my-2"
        :id="'Weapon' + `${index + 1}`">
        <div class="col-span-4 p2 text-clip ">{{ armor.name }}</div>
        <div @click="deleteRow(index)"
            class="row-span-2 p-2 text-clip w-full bg-darkred-red rounded-xl border-2 border-darkred-dark text-darkred-light font-medium hover:cursor-pointer">
            X</div>
        <div v-if="armor.effect" class="col-span-2 p2 text-clip ">Ефект: {{ armor.effect }}</div>
        <div v-else class="col-span-2 p2 text-clip ">Ефект відсутній</div>
        <div class="p2 text-clip ">Захист {{ armor.resist }}</div>
        <div class="p2 text-clip ">Вимоги: {{Object.entries(armor.requirement).map(([key, value]) =>
            `${key}:${value}`).join(',')}}</div>
    </div>
    <select name="Armors" id="Armors" @change="addRow" :class=" ['min-w-fit max-w-4/5 my-2 px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic',
        'tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red',
        'hover:border-darkred-red text-center justify-self-center']">
        <option value="default" class="bg-darkred-dark text-darkred-bright">Виберіть броню</option>
        <option v-for="armor in props.armors_all" :value="armor.id" class="bg-darkred-dark text-darkred-bright text-clip">
            {{ armor.name }} </option>
    </select>
</template>