<script setup>
import { ref } from 'vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';

const props = defineProps({
    currency_array: { type: Array, required: true },
    callback: { type: Function, required: true }
})



function updateCurrency(name, value) {
    props.currency_array.forEach(el => {
        if(el.name === name) el.value += value
    })
    props.callback(props.currency_array)
}
</script>

<template>
    <div v-for="currency, index in props.currency_array" :key="currency.id"
        class="p-2 space-y-2 font-univers border-2 rounded-lg border-darkred-light_gray">

        <FormAddSubtract v-if="typeof (currency.value) === 'number'" :value="currency.value" :callback="updateCurrency"
            :entity_name="currency.name" class="mx-auto" :icon="currency.icon" />

    </div>
</template>