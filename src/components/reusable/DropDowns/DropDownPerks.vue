<script setup>
import { ref, toRaw } from 'vue';
import ImportantField from '../ImportantField.vue';


const selectValue = ref(null)

const perkValue = defineModel('selected', { type: Object, required: true, default: '' })

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

function selectPerkType(){
    perkValue.value = toRaw(props.entity_array.find(el => el.name === selectValue.value.value))
}

</script>

<template>
    <div class="text-lg font-gothic">

        <div>
            {{ props.label }}:
            <ImportantField v-if="props.important" />
        </div>

        <select ref="selectValue" @change="selectPerkType()" :name="props.entity_name"
            :id="props.entity_name"
            class="w-full appearance-none p-2 m-1 border-2 rounded-lg border-light_gray text-darkred-dark font-gothic focus:outline-none focus:ring-2 focus:ring-darkred-dark transition cursor-pointer">

            <option value="null">
                Не вибарно
            </option>

            <option v-for="entity in props.entity_array" :key="entity.id" :value="entity.name" :selected="entity.id === perkValue.id">
                {{ entity.name }}
            </option>

        </select>

    </div>
</template>