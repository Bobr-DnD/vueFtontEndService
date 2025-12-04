<script setup>
import { ref, nextTick } from 'vue';
import { PencilIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';
import { notify } from '/utils/notification';

const props = defineProps({
    entity_name: {
        type: String,
        required: true
    },
    min: {
        type: Number,
        default: null
    },
    max: {
        type: Number,
        default: 1
    },
    callback: {
        type: Function,
        required: true
    }
})

const minReadonly = ref(true)
const maxReadonly = ref(true)
const minInput = ref(null)
const maxInput = ref(null)

const editField = async (button) => {
    switch (button) {
        case 'min':
            minReadonly.value = false
            await nextTick()
            minInput.value.focus()
            break;
        case 'max':
            maxReadonly.value = false
            await nextTick()
            maxInput.value.focus()
            break
    }
}

function saveField(button) {
    switch (button) {
        case 'min':
            minReadonly.value = true
            break;
        case 'max':
            maxReadonly.value = true
            break
    }
    let min = null
    if (min) min = parseInt(minInput.value.value)
    let max = parseInt(maxInput.value.value)
    if (min >= max) {
        max = min + 1
        notify({ message: 'Мінімальне значення більше за максимальне', type: 'error' })
    }

    props.callback(min, max)
}

</script>

<template>
    <div class="p-2 font-gothic">

        <div class="w-full text-darkred-dark font-semibold text-xl tracking-wide">
            {{ props.entity_name }}
        </div>

        <div class="flex flex-col gap-2 items-end">

            <form @submit.prevent class="w-full">

                <label :for="entity_name + 'min'"
                    class="w-full text-darkred-dark font-medium text-lg tracking-wide">Перше
                    значення(мінімальне):</label>


                <div class="w-full grid items-end gap-2"
                    :class="minReadonly ? 'grid-cols-[1fr_44px]' : 'grid-cols-[1fr_44px_44px]'">

                    <input :ref="'minInput'" :id="entity_name + 'min'" type="number" :value="props.min" placeholder="значення відстунє"
                        :disabled="minReadonly"
                        class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full
               disabled:bg-darkred-dark_gray disabled:text-darkred-light placeholder-darkred-light/60 transition-all duration-200" />

                    <div @click="editField('min')"
                        class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                        <PencilIcon class="w-4 h-4 text-darkred-light md:hover:cursor-pointer" />
                    </div>

                    <div v-if="!minReadonly" @click="saveField('min')"
                        class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                        <CheckCircleIcon class="w-7 h-7 md:hover:cursor-pointer text-darkred-light" />
                    </div>

                </div>

            </form>

            <form @submit.prevent class="w-full">


                <label :for="entity_name + 'max'"
                    class="w-full text-darkred-dark font-medium text-lg tracking-wide">Друге
                    значення(максимальне):</label>

                <div class="w-full grid items-end gap-2"
                    :class="maxReadonly ? 'grid-cols-[1fr_44px]' : 'grid-cols-[1fr_44px_44px]'">

                    <input :ref="'maxInput'" :id="entity_name + 'max'" type="number" :value="props.max" placeholder="0"
                        :disabled="maxReadonly"
                        class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full
               disabled:bg-darkred-dark_gray disabled:text-darkred-light placeholder-darkred-light/60 transition-all duration-200" />

                    <div @click="editField('max')"
                        class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                        <PencilIcon class="w-4 h-4 text-darkred-light md:hover:cursor-pointer" />
                    </div>

                    <div v-if="!maxReadonly" @click="saveField('max')"
                        class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                        <CheckCircleIcon class="w-7 h-7 md:hover:cursor-pointer text-darkred-light" />
                    </div>

                </div>

            </form>

        </div>

    </div>
</template>