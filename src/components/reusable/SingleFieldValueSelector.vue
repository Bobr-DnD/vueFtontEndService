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

        <div class="relative w-full">
            
            <select class="w-full p-3 pr-10 rounded-xl bg-darkred-dark text-darkred-light font-gothic
           borde border-darkred-red/40 shadow-md outline-none cursor-pointer
           transition-all duration-200 focus:border-darkred-red focus:ring-2 focus:ring-darkred-red/40
           hover:bg-darkred-dark/80" :name="props.label" :id="props.field_name"
                @change="props.callback(props.field_name, $event.target.value)">

                <option class="bg-darkred-dark text-darkred-light hover:bg-darkred-red/20 p-2"
                    v-for="option in props.options" :value="option" :selected="props.status ? true : false">
                    {{ option }}
                </option>

            </select>

            <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
           text-darkred-light transition-all duration-200
           group-hover:rotate-180">
                ▼
            </div>
        </div>

    </div>

</template>

<style scoped>
select {
    appearance: none;
}
</style>