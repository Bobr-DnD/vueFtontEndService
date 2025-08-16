<script setup>
const value = defineModel('value', { type: String, required: true })

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
    <form class="flex items-center max-w-80 p-4 font-univers mb-4 shadow-[rgba(0,0,0,0.5)_0px_8px_24px] rounded-xl">
        <label :for="entity_name" class="mr-2 w-full text-darkred-dark font-semibold text-lg tracking-wide">
            {{ entity_name }}
        </label>
        <input :id="entity_name" type="text" v-model="value" class="bg-darkred-gray max-w-28 text-darkred-light text-md placeholder-darkred-dark border border-darkred-dark rounded-md px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-darkred-dark transition" />
    </form>


</template>