<script setup>

const props = defineProps({
    field_name: {
        Type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    callback: {
        type: Function,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array,
        required: true
    }
})

</script>

<template>
    <div class="flex flex-col items-start justify-center gap-2">
        <div class="text-lg font-gothic">{{ props.label }}:</div>

        <select class="w-full flex items-center gap-4 p-2 rounded-xl bg-darkred-dark text-darkred-light"
            :name="props.label" :id="props.field_name" @change="props.callback(props.field_name, $event.target.value)">
            <option class="p-1" v-for="option in props.options" :value="option" :selected="props.status ? true : false">
                {{ option }}</option>
        </select>

    </div>

</template>