<script setup>
import { ref } from 'vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';

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
    <div v-if="!currency_hidden" v-for="value, field in props.currency" class="space-y-2 font-univers">
        <FormAddSubtract v-if="typeof (value) === 'number'" :value="value" :callback="updateCurrency"
            :entity_name="field" class="mx-auto shadow-[rgba(0,0,0,0.5)_0px_4px_16px]" />
    </div>
</template>