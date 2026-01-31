<script setup>
import { computed } from 'vue';

import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    baseCharacteristics: { type: Object, required: true },
    computedCharacteristics: { type: Object, required: true },
    callback: { type: Function, required: true },
    field_removable: { type: Boolean, required: false, default: false }
})

const characteristics = computed(() => {
    const merged = {}
    Object.keys(props.baseCharacteristics).forEach(key => {
        if (props.baseCharacteristics[key] !== props.computedCharacteristics[key])
            merged[key] = `${props.baseCharacteristics[key]}(${props.computedCharacteristics[key]})`
        else merged[key] = props.baseCharacteristics[key]
        
    })

    return merged
})

function updateFields(name, value) {
    props.baseCharacteristics[name] += value
    props.callback(props.baseCharacteristics)
}

</script>

<template>
    <div v-for="value, name in characteristics" :key="Math.random().toString(24).slice(2)"
        class='grid justify-center items-center p-2 border-2 rounded-lg border-darkred-light_gray'
        :class="props.field_removable ? 'grid-cols-[1fr_44px]' : 'grid-cols-1'">

        <div class="flex gap-2 items-center">

            <div class="text-ellipsis text-darkred-dark font-semibold text-xl tracking-wide">{{ name }}: {{ value }}
            </div>

            <section class="flex items-center justify-center gap-2 self-end">

                <button>
                    <PlusIcon @click="updateFields(name, 1)"
                        class="w-10 h-10 p-2 border-2 bg-darkred-dark_gray text-darkred-light border-darkred-red rounded-lg" />
                </button>

                <button>
                    <MinusIcon @click="updateFields(name, -1)"
                        class="w-10 h-10 p-2 border-2 bg-darkred-dark_gray text-darkred-light border-darkred-red rounded-lg" />
                </button>

            </section>
        </div>

    </div>
</template>