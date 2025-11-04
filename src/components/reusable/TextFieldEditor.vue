<script setup>
import { PencilSquareIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

const props = defineProps({
    placeholder: { type: String, required: true },
    value: { type: String, required: false },
    fieldName: {type: String, required: true}
})

let fieldReadonly = ref(true)

function editField() {
    fieldReadonly.value = !fieldReadonly.value
}

</script>

<template>
    <div class="flex items-center m-2 space-x-2">
        <form submit.prevent action="" class="">
            <input type="text" :disabled="fieldReadonly" :placeholder="props.placeholder" :value="props.value"
                class="w-min-fit p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg"> <!-- disabled doesnt work-->
        </form>
        <PencilSquareIcon class="w-10 hover:cursor-pointer hover:text-greenish-mid" @click="editField" :class="!fieldReadonly ? 'text-greenish-mid' : ''"/>
        <CheckCircleIcon class="w-10 hover:cursor-pointer hover:text-greenish-mid" />
    </div>
</template>