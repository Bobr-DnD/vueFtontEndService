<script setup>
import { ref, onMounted } from 'vue';
import ImportantField from '../ImportantField.vue';

const selectValue = ref(null)

const selectedValue = defineModel('selected', { type: String, required: true })

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    entity_name: {
        type: String,
        required: true
    },
    entity_array: {
        type: Array,
        required: true
    }
})

onMounted(() => {
    selectedValue.value = selectValue.value.value
})

</script>

<template>
    <div class="text-lg font-gothic p-2">

        <div>
            {{ props.label }}:
            <ImportantField v-if="props.important" />
        </div>

        <select ref="selectValue" @change="selectedValue = selectValue.value" :name="props.entity_name"
            :id="props.entity_name"
            class="w-full appearance-none p-1 pl-2 bg-darkred-light border-4  rounded-lg text-darkred-dark font-gothic focus:outline-none focus:ring-2 focus:ring-darkred-dark transition cursor-pointer">

            <option v-for="entity in props.entity_array" :key="entity.id" :value="entity.name">
                {{ entity.name }}
            </option>

        </select>

    </div>
</template>