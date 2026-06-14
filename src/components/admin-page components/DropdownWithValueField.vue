<script setup>
import { ref, toRaw } from 'vue';

import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';

const value = ref('')
const characteristic = ref('')

const props = defineProps({
    list: {
        type: Array,
        required: true,
        default: []
    },
    callback: {
        type: Function,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

</script>

<template>

    <select v-model="characteristic"
        class="min-w-80 max-w-fit h-16 text-center appearance-none p-1 bg-darkred-light border-4 border-darkred-dark rounded-lg text-darkred-dark font-gothic focus:outline-none focus:ring-2 focus:ring-darkred-dark transition cursor-pointer">
        <option disabled selected value="">Вибрати характеристику</option>
        <option v-for="entity in props.list" :value="entity.name" :key="entity.id">{{ entity.name }}</option>
    </select>

    <form @submit.prevent class="flex flex-col items-start justify-center w-80 p-2">

        <label :for="props.name" class="font-gothic">
            Значення:
        </label>

        <input :id="`${props.name}_input`" type="text" v-model="value" :name="props.name" placeholder="0"
            class="p-1 border-4 font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-dark" />
    </form>

    <div class="p-2 w-80">
        <AprroveButtonWithText @click="props.callback({ characteristic: toRaw(characteristic), value: toRaw(value) })"
            text="Додати поле" />
    </div>

</template>