<script setup>
import {defineProps, defineModel, ref} from 'vue'
import FormString from './FormString.vue'
import FormNumber from './FormNumber.vue'
import FormDropDown from './FormDropdown.vue'

const armors = defineModel('armors', {type: Array, required:true})

const props = defineProps({

})

let armor = ref(null)
</script>

<template>
    <FormDropDown class="flex justify-self-center w-2/5 " entity_name="Armor" v-model:armors="armors"/>
</template>
