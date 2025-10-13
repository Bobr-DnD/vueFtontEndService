<script setup>
import { ref } from 'vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import HideButton from '../reusable/HideButton.vue';
import { CurrencyDollarIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    currency: { type: Object, required: true },
    callback: {type: Function, required: true}
})

let currency_hidden = ref(true)

function updateCurrency(name, value) {
    props.currency[name] += value
    props.callback(props.currency)
}
</script>

<template>
    <HideButton textShow="Показати баланс" textHide="Приховати баланс" v-model:hidden="currency_hidden" :mainIcon="CurrencyDollarIcon"/>

    <div v-if="!currency_hidden" v-for="value, field in props.currency" class="space-y-2 font-univers">
        <FormAddSubtract v-if="typeof (value) === 'number'" :value="value" :label="'Currency_' + field" @updateValue="updateCurrency"
            :entity_name="field" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />
    </div>
</template>