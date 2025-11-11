<script setup>
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import { ref } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    }
})

let name = ref('')
let min = ref(0)
let max = ref(0)
let value = ref(0)
let healing = ref(0)
let color_min = ref('')
let color_max = ref('')
let color_mid = ref('')

function addHealthField() {
    const health = {
        name: name.value.value,
        min: min.value.value,
        max: max.value.value,
        value: value.value.value,
        healing: healing.value.value,
        colors: [color_max.value.value, color_mid.value.value, color_min.value.value]
    }

    console.log(health);

}

function resetFields() {
    min.value.value = 0
    max.value.value = 0
    value.value.value = 0
    color_min.value.value = '#000000'
    color_max.value.value = '#000000'
    color_mid.value.value = '#000000'
}

</script>

<template>
    <div>
        <form @submit.prevent class="grid grid-cols-2 gap-2 items-start justify-center w-full">

            <section>
                <label :for="props.name" class="text-lg font-gothic">Назва поля:</label>
                <input :ref="'name'" :name="props.name" :id="props.name" placeholder="" type="text"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label :for="`${props.name}_healing`" class="text-lg font-gothic">Значення відновлення:</label>
                <input :ref="'healing'" :name="`${props.name}_healing`" :id="`${props.name}_healing`" placeholder="0"
                    type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label :for="`${props.name}_min`" class="text-lg font-gothic">Мінімальне значення:</label>
                <input :ref="'min'" :name="`${props.name}_min`" :id="`${props.name}_min`" placeholder="0" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_min" class="text-lg font-gothic">Колір мінімального значення:</label>
                <input :ref="'color_min'" name="color_min" id="color_min" type="color"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

            <section>
                <label :for="`${props.name}_max`" class="text-lg font-gothic">Максимальне значення:</label>
                <input :ref="'max'" :name="`${props.name}_max`" :id="`${props.name}_max`" placeholder="0" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_max" class="text-lg font-gothic">Колір максимального значення:</label>
                <input :ref="'color_max'" name="color_max" id="color_max" type="color"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

            <section>
                <label :for="`${props.name}_value`" class="text-lg font-gothic">Нинішнє значення:</label>
                <input :ref="'value'" :name="`${props.name}_value`" :id="`${props.name}_value`" placeholder="0"
                    type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_mid" class="text-lg font-gothic">Колір значення посередині:</label>
                <input :ref="'color_mid'" name="color_mid" id="color_mid" type="color"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

        </form>

        <section class="flex items-center justify-start mt-2 gap-4">
            <AprroveButtonWithText text="Додати" class="w-32 h-12 flex justify-center items-center"
                @click="addHealthField" />
            <RejectButtonWithText text="Очистити" class="w-32 h-12 flex justify-center items-center"
                @click="resetFields" />
        </section>

    </div>

</template>