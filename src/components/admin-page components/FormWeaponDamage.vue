<script setup>
import { ref, nextTick } from 'vue';
import { PencilIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    damage: {
        type: Array,
        default: []
    },
    entity_name: {
        type: String,
        required: true
    }
})

const damageReadonly = ref(true)
const typeReadonly = ref(true)
const damageInput = ref(null)
const typeInput = ref(null)

const editField = async (button) => {
    switch (button) {
        case 'damage':
            damageReadonly.value = false
            await nextTick()
            damageInput.value.focus()
            break;
        case 'type':
            typeReadonly.value = false
            await nextTick()
            typeInput.value.focus()
            break
    }
}

function saveField(button) {
    switch (button) {
        case 'damage':
            damageReadonly.value = true
            break;
        case 'type':
            typeReadonly.value = true
            break
    }
}

</script>

<template>
    <div class="p-2 font-gothic">

        <div class="w-full text-darkred-dark font-semibold text-xl tracking-wide">Налаштування урону:</div>

        <div v-for="d in props.damage" class="flex flex-col items-start justify-center text-lg text-darkred-dark">

            <div>
                {{ d.damage }}
            </div>

            <div>
                {{ d.type }}
            </div>

        </div>

        <div>
            <form @submit.prevent class="grid gap-2"
                :class="damageReadonly ? 'grid-cols-[1fr_44px]' : 'grid-cols-[1fr_44px_44px]'">
                <div>
                    <label :for="entity_name + 'name'"
                        class="w-full text-darkred-dark font-medium text-lg tracking-wide">Опис урону:</label>

                    <input :ref="'damageInput'" type="text" :disabled="damageReadonly" placeholder="2d6" :value="damage.damage" class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full
               disabled:bg-darkred-dark_gray disabled:text-darkred-light placeholder-darkred-light/60 transition-all duration-200">
                </div>


                <div @click="editField('damage')"
                    class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                    <PencilIcon class="w-4 h-4 text-darkred-light md:hover:cursor-pointer" />
                </div>

                <div v-if="!damageReadonly" @click="saveField('damage')"
                    class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                    <CheckCircleIcon class="w-7 h-7 md:hover:cursor-pointer text-darkred-light" />
                </div>
            </form>

            <form @submit.prevent class="grid gap-2"
                :class="typeReadonly ? 'grid-cols-[1fr_44px]' : 'grid-cols-[1fr_44px_44px]'">
                <div>
                    <label :for="entity_name + 'type'"
                        class="w-full text-darkred-dark font-medium text-lg tracking-wide">Тип урону:</label>

                    <input :ref="'typeInput'" type="text" :disabled="typeReadonly" placeholder="Ріжучий" :value="damage.type" class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full
               disabled:bg-darkred-dark_gray disabled:text-darkred-light placeholder-darkred-light/60 transition-all duration-200">
                </div>

                <div @click="editField('type')"
                    class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                    <PencilIcon class="w-4 h-4 text-darkred-light md:hover:cursor-pointer" />
                </div>

                <div v-if="!typeReadonly" @click="saveField('type')"
                    class="flex justify-center items-center bg-darkred-dark self-end border-2 w-11 h-11 border-darkred-red rounded-xl md:hover:cursor-pointer">
                    <CheckCircleIcon class="w-7 h-7 md:hover:cursor-pointer text-darkred-light" />
                </div>
            </form>
        </div>

    </div>

</template>