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

const weapon = ref(props.weapon)


const state = reactive({
    unsavedChanges: false
})
function markUnsaved(){
    state.unsavedChanges = true
    console.log(weapon.value);
}

function updateWeapon(field, value) {
    weapon.value[field] = value
    markUnsaved()
}

function updateRange(min, max){
    weapon.value.range.min = min
    weapon.value.range.max = max
    markUnsaved()
}

function updateActionPoints(min, max){
    weapon.value.actionPoints.min = min
    weapon.value.actionPoints.max = max
    markUnsaved()
}

</script>

<template>
    <div class="grid grid-cols-4 gap-2">
        <SingleFieldEditor class="" placeholder="Назва" :value="weapon.name" fieldName="name" type="text"
            :callback="updateWeapon" />

        <SingleFieldEditor class="" placeholder="Ефект" :value="weapon.effect" fieldName="effect" type="text"
            :callback="updateWeapon" />

        <SingleFieldEditor class="" placeholder="Опис" :value="weapon.description" fieldName="description"
            type="text" :callback="updateWeapon" />

        <SingleFieldEditor placeholder="Ціна" :value="weapon.price" fieldName="price" type="number"
            :callback="updateWeapon" />

        <FormObjectMinMaxFields entity_name="Очки дії" :min="weapon.actionPoints.min" :max="weapon.actionPoints.max" :callback="updateActionPoints"/>

        <FormObjectMinMaxFields entity_name="Дальність атаки" :min="weapon.range.min" :max="weapon.range.max" :callback="updateRange"/>

        <SingleFieldValueSelector class="self-start" field_name="legendary" label="Тип зброї" :callback="updateWeapon"
            :status="props.weapon.legendary" />

        <FormWeaponDamage :damage="weapon.damage" entity_name="Damage" />

    </div>
</template>