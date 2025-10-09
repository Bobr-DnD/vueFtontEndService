<script setup>
import { ref } from 'vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import { CurrencyDollarIcon, ChevronDoubleUpIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits(['updateCurrency'])

const props = defineProps({
    currency: { type: Object, required: true }
})

let currency_text = ref('Показати баланс')
let currency_hidden = ref(true)

function updateCurrency(name, value) {
    props.currency[name] += value
    emit('updateCurrency', props.currency)
}
</script>

<template>
    <h2 @click="
        currency_hidden = !currency_hidden;
    currency_text === 'Показати баланс'
        ? (currency_text = 'Приховати баланс')
        : (currency_text = 'Показати баланс')" class="px-4 py-2 text-center text-xl font-univers font-semibold mb-2 rounded-lg hover:cursor-pointer transition-all duration-500 
            ease-in-out select-none grid grid-cols-[40px_1fr_60px] items-center justify-items-center"
        :class="currency_hidden ? 'bg-darkred-gray text-darkred-dark' : 'bg-darkred-dark text-darkred-light'">

        <CurrencyDollarIcon class="w-8 h-8" />
        {{ currency_text }}
        <ChevronDoubleUpIcon class="w-8 h-8 transition-transform duration-300"
            :class="currency_hidden ? 'rotate-180' : 'rotate-0'" />
    </h2>

    <div v-if="!currency_hidden" v-for="value, field in props.currency">
        <FormAddSubtract v-if="typeof (value) === 'number'" :value="value" :label="'Currency_' + field" @updateValue="updateCurrency"
            :entity_name="field" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />
    </div>
</template>