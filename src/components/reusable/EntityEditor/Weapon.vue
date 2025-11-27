<script setup>
import { ref, reactive, watch } from 'vue';
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import { toEmptyWeapon } from '/utils/objects.dto';
import SingleFieldValueSelector from '../SingleFieldValueSelector.vue';

const props = defineProps({
    weapon: {
        type: Object,
        default: toEmptyWeapon({})
    }
})


const state = reactive({
    unsavedChanges: false
})

function updateWeapon(field, value) {
    switch (value) {
        case 'Легендарна':
            value = true
            break
        case 'Звичайна':
            value = false
            break
    }
    props.weapon[field] = value

    console.log(props.weapon);

}


</script>

<template>
    <div class="grid grid-cols-4">
        <SingleFieldEditor class="col-span-2" placeholder="Назва" :value="props.weapon.name" fieldName="name"
            type="text" :callback="updateWeapon" />

        <SingleFieldValueSelector field_name="legendary" label="Тип зброї" :callback="updateWeapon"
            :status="props.weapon.legendary" :options="['Звичайна', 'Легендарна']" />

        <SingleFieldEditor placeholder="Ціна" :value="props.weapon.price" fieldName="price" type="number"
            :callback="updateWeapon" />

        <SingleFieldEditor class="col-span-2" placeholder="Ефект" :value="props.weapon.effect" fieldName="effect"
            type="text" :callback="updateWeapon" />

        <SingleFieldEditor class="col-span-2" placeholder="Опис" :value="props.weapon.description"
            fieldName="description" type="text" :callback="updateWeapon" />

    </div>
</template>