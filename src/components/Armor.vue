<script setup>
import { ref } from 'vue'
import FormString from './reusable/FormString.vue'
import FormNumber from './reusable/FormNumber.vue'
import FormDropDown from './FormDropdown.vue'

const armors = defineModel('armors', {type: Array, required:true})


//console.log(armors);

</script>

<template>
    <FormDropDown class="flex justify-self-center w-2/5 " entity_name="Armor" v-model:armors="armors"/>
    <div class="grid grid-cols-2 gap-2 justify-items-center mt-4">
        <div v-for="i in 4" :key="i">{{ i }} texts</div>
        <div>
            <FormString label="ArmorName" :entity_name="armors[0].name" v-model:value="armors[0].name" />
        </div>
    </div>
</template>
