<script setup>
import { ref } from 'vue';
import ImportantField from '../ImportantField.vue';


const selectValue = ref(null)

const selectedValue = defineModel('selected', { type: String, required: true, default: '' })

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    important: {
        type: Boolean,
        deafult: false
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

</script>

<template>
    <div class="text-lg font-gothic">

        <div>
            {{ props.label }}:
            <ImportantField v-if="props.important" />
        </div>

        <select ref="selectValue" @change="selectedValue = selectValue.value" :name="props.entity_name"
            :id="props.entity_name"
            class="w-full appearance-none p-2 m-1 border-2 rounded-lg border-light_gray text-darkred-dark font-gothic focus:outline-none focus:ring-2 focus:ring-darkred-dark transition cursor-pointer">

            <option value="null">
                Не вибарно
            </option>

            <option v-for="entity in props.entity_array" :key="entity.id" :value="entity.id" :selected="entity.id === selectedValue">
                {{ entity.name }}
            </option>

        </select>

    </div>
</template>