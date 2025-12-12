<script setup>
import EntityModal from './EntityModal.vue';
import { ref } from 'vue';

const props = defineProps({
    entity: {
        type: Object,
        required: true
    },
    callback_add: {
        type: Function,
        required: true
    },
    callback_remove: {
        type: Function,
        required: true
    }
})

const modal_hidden = ref(true)

function closeModal(){
    modal_hidden.value = true
}

</script>

<template>
    <div class="w-full">
        <div @click="modal_hidden = !modal_hidden" class="p-2 w-full bg-darkred-dark text-darkred-light border-2 rounded-2xl
            grid grid-cols-4 gap-1 justify-items-center items-center font-univers font-medium text-lg md:hover:cursor-pointer">

            <div class="col-span-4 text-xl font-semibold">{{ props.entity.name }}</div>

            <div v-if="props.entity.description" class="col-span-4 justify-self-start">Опис: {{ props.entity.description
                }}
            </div>

            <div v-if="props.entity.characteristics" class="w-full col-span-4 flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Характеристики: </div>

                <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                    <div v-for="value, name in props.entity.characteristics" :key="Math.random().toString(24).slice(2)"
                        class="py-1 px-2 rounded-lg even:bg-darkred-light_gray ">
                        {{ name }}: {{ value }}
                    </div>
                </div>

            </div>

            <div v-if="props.entity.requirement" class="w-full col-span-4 flex flex-wrap gap-1">

                <div class="basis-full text-center text-xl">Вимоги: </div>

                <div class="p-1 w-full bg-darkred-light rounded-lg text-darkred-dark flex flex-col gap-1">
                    <div v-for="value, name in props.entity.requirement" :key="Math.random().toString(24).slice(2)"
                        class="py-1 px-2 rounded-lg even:bg-darkred-light_gray ">
                        {{ name }}: {{ value }}
                    </div>
                </div>

            </div>

        </div>

        <EntityModal v-if="!modal_hidden" :entity="props.entity" :callback_add="props.callback_add"
            :callback_delete="props.callback_remove" :callback_close="closeModal"/>
    </div>

</template>