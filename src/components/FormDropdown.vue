<script setup>
const entities = defineModel('armors', { type: Array, required: true })
const props = defineProps({
    entity_name: {
    },
})
</script>

<template>
    <select :name="props.entity_name"
        class="px-4 py-2 bg-fallout-blackish border border-fallout-brown rounded-md text-fallout-sand font-gothic tracking-wide uppercase shadow-inner outline-none transition-all duration-200 focus:border-fallout-red focus:ring-2 focus:ring-fallout-red hover:border-fallout-red text-center">
        <option v-for="entity in entities" :key="entity.id" :value="entity.id"
            class="bg-fallout-blackish text-fallout-sand">
            {{ entity.name }}
        </option>
    </select>
</template>