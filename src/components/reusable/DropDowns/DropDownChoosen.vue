<script setup>
import { ref } from 'vue';

const selectValue = ref(null)

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    entity_name: {
        type: String,
        required: true
    },
    selected: {
        type: String,
        default: ''
    },
    entity_array: {
        type: Array,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
})

</script>

<template>
    <div class="text-lg font-gothic">

        <div>
            {{ props.label }}:
        </div>

        <select ref="selectValue" @change="selectValue.value !== 'none' ? props.callback(selectValue.value) : console.log('xuita')" :name="props.entity_name"
            :id="props.entity_name"
            class="w-full appearance-none p-1 pl-2 bg-darkred-light border-4 border-darkred-dark rounded-lg text-darkred-dark font-gothic focus:outline-none focus:ring-2 focus:ring-darkred-dark transition cursor-pointer">
            
            <option value="none">
                Не вибарно
            </option>
            
            <option v-for="entity in props.entity_array" :value="entity.id" :selected="entity.name === props.selected">
                {{ entity.name }}
            </option>

        </select>
        
    </div>
</template>