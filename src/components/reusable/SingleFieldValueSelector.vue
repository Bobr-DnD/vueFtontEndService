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
    }
})

const options = ['Звичайна', 'Легендарна']

</script>

<template>
    <div class="flex flex-col items-start justify-center gap-2 p-2">
        <div class="text-xl font-semibold font-gothic">{{ props.label }}:</div>

        <div class="relative w-full">
            
            <select class="w-full p-3 pr-10 rounded-xl bg-brand-base text-brand-text font-gothic
           borde border-brand-accent/40 shadow-md outline-none cursor-pointer
           transition-all duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/40
           hover:bg-brand-base/80" :name="props.label" :id="props.field_name"
                @change="props.callback(props.field_name, $event.target.value === 'Легендарна' ? true : false )">

                <option class="bg-brand-base text-brand-text hover:bg-brand-accent/20 p-2"
                    v-for="option in options" :key="option" :value="option" :selected="props.status ? true : false">
                    {{ option }}
                </option>

            </select>

            <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
           text-brand-text transition-all duration-200
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