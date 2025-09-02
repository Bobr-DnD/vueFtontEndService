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
    <form @submit.prevent class="flex items-center max-w-80 p-4 font-univers mb-4 rounded-xl">
        <label :for="entity_name" class="mr-2 w-full text-darkred-dark font-semibold text-lg tracking-wide">
            {{ entity_name.toUpperCase() }}:
        </label>
        <input  :id="entity_name" type="number" v-model="value" class="no-arrows bg-darkred-gray max-w-28 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
    </form>

</template>