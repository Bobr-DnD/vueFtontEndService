<script setup>
const entities = defineModel('armors', { type: Array, required: true })
const props = defineProps({
    entity_name: {
    },
})
</script>

<template>
    <select :name="props.entity_name"
        class="px-4 py-2 bg-darkred-light border border-darkred-dark rounded-md text-darkred-dark font-gothic tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red hover:border-darkred-red text-center">
        <option v-for="entity in entities" :key="entity.id" :value="entity.id"
            class="bg-darkred-dark text-darkred-bright">
            {{ entity.name }}
        </option>
    </select>
</template>