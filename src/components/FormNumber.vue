<script setup>
const value = defineModel('value', { type: Number, required: true })

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    entity_name: {
        type: String,
        required: true
    }

})
</script>

<template>
    <form class="flex flex-col w-full max-w-xs mx-auto font-univers mb-3">
        <label :for="entity_name" class="mb-2 text-fallout-dark font-semibold text-sm tracking-wide">
            {{ entity_name }}: {{ value }}
        </label>
        <input :id="entity_name" type="number" v-model="value" class="bg-fallout-sand text-fallout-dark placeholder-fallout-brown border border-fallout-brown rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-fallout-red transition" />
    </form>

</template>