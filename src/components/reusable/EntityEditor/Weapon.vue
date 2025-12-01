<script setup>
import { ref, reactive, watch } from 'vue';
import { toEmptyWeapon } from '/utils/objects.dto';
import SingleFieldEditor from '@/components/reusable/SingleFieldEditor.vue';
import SingleFieldValueSelector from '../SingleFieldValueSelector.vue';
import FormObjectMinMaxFields from '@/components/admin-page components/FormObjectMinMaxFields.vue';
import FormWeaponDamage from '@/components/admin-page components/FormWeaponDamage.vue';

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
    props.weapon[field] = value

    console.log(props.weapon);

}


</script>

<template>
    <div class="grid grid-cols-4 gap-2">
        <SingleFieldEditor class="" placeholder="Назва" :value="props.weapon.name" fieldName="name" type="text"
            :callback="updateWeapon" />

        <SingleFieldEditor class="" placeholder="Ефект" :value="props.weapon.effect" fieldName="effect" type="text"
            :callback="updateWeapon" />

        <SingleFieldEditor class="" placeholder="Опис" :value="props.weapon.description" fieldName="description"
            type="text" :callback="updateWeapon" />

        <SingleFieldEditor placeholder="Ціна" :value="props.weapon.price" fieldName="price" type="number"
            :callback="updateWeapon" />

        <FormObjectMinMaxFields entity_name="Очки дії" :min="weapon.actionPoints.min" :max="weapon.actionPoints.max" />

        <FormObjectMinMaxFields entity_name="Дальність атаки" :min="weapon.range.min" :max="weapon.range.max" />

        <SingleFieldValueSelector class="self-start" field_name="legendary" label="Тип зброї" :callback="updateWeapon"
            :status="props.weapon.legendary" />

        <FormWeaponDamage :damage="weapon.damage" entity_name="Damage" />

    </div>
</template>