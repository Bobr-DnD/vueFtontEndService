<script setup>
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import DeleteButton from './Buttons/DeleteButton.vue';

const props = defineProps({
    fields: { type: Object, required: true },
    callback: { type: Function, required: true },
    field_removable: { type: Boolean, required: false, default: false }
})

function updateFields(name, value) {
    if (typeof (value) === 'string') props.fields[name] = value
    else props.fields[name] += value
    props.callback(props.fields)
}

function removeField(value) {
    const key = Object.keys(props.fields).find(k => props.fields[k] === value)
    delete props.fields[key]
    props.callback(props.fields)
}

</script>

<template>
    <div v-for="value, name in props.fields" class='grid justify-center items-center' :class="props.field_removable ? 'grid-cols-[1fr_44px]' : 'grid-cols-1'">

        <FormString v-if="typeof (value) === 'string'" :label="'CustomFields_' + name" :entity_name="name"
            :value="props.fields[name]" :callback="updateFields" class="w-full mx-auto" />

        <FormAddSubtract v-if="typeof (value) === 'number'" :label="'CustomFields_' + name" :entity_name="name"
            :value="props.fields[name]" :callback="updateFields" class="w-full mx-auto" />

        <DeleteButton v-if="props.field_removable"
            :class="!props.field_removable ? 'bg-darkred-light text-darkred-dark hover:cursor-default' : 'bg-darkred-red text-darkred-light'"
            class="flex justify-center items-center text-xl w-11 h-11 mb-2 self-end" @click="removeField(value)" />
    </div>
</template>