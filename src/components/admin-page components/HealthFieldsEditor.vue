<script setup>
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import { ref } from 'vue';
import { toHealthObjectField } from '/utils/objects.dto';
import { notify } from '/utils/notification';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 25
    },
    value: {
        type: Number,
        default: 0
    },
    healing: {
        type: Number,
        default: 5
    },
    colors: {
        type: Array,
        default: [
            "#3E5F44",
            "#FABC3F",
            "#8E1616"]
    },
    placeholder: {
        type: Boolean,
        default: true
    },
    callback: {
        type: Function,
        required: true
    }
})


const name = ref(0)
const min = ref(0)
const max = ref(0)
const value = ref(0)
const healing = ref(0)
const color_min = ref('')
const color_max = ref('')
const color_mid = ref('')

function addHealthField() {
    if (!name.value.value) {
        notify({ message: 'Вкажіть назву поля', type: 'error' })
        return
    }
    else if (min.value.value > max.value.value) {
        notify({ message: 'Мінімальне значення більше за максимальне', type: 'error' })
        return
    }
    else if (value.value.value > max.value.value) {
        notify({ message: 'Нинішнє значення було встановлено на максимальне', type: 'warning' })
        value.value.value = max.value.value
    }

    let health = {
        name: name.value.value,
        min: parseInt(min.value.value),
        max: parseInt(max.value.value),
        value: parseInt(value.value.value),
        healing: parseInt(healing.value.value),
        colors: [color_max.value.value, color_mid.value.value, color_min.value.value]
    }

    health = toHealthObjectField(health)
    props.callback(health)
}

function resetFields() {
    name.value.value = ''
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
                <input :ref="'name'" :name="props.name" :id="props.name" :placeholder="props.name"
                    :value="!props.placeholder ? props.name : ''" type="text"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label :for="`${props.name}_healing`" class="text-lg font-gothic">Значення відновлення:</label>
                <input :ref="'healing'" :name="`${props.name}_healing`" :id="`${props.name}_healing`"
                    :placeholder="props.healing" :value="!props.placeholder ? props.healing : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label :for="`${props.name}_min`" class="text-lg font-gothic">Мінімальне значення:</label>
                <input :ref="'min'" :name="`${props.name}_min`" :id="`${props.name}_min`" :placeholder="props.min"
                    :value="!props.placeholder ? props.min : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_min" class="text-lg font-gothic">Колір мінімального значення:</label>
                <input :ref="'color_min'" name="color_min" id="color_min" type="color" :value="props.colors[2]"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

            <section>
                <label :for="`${props.name}_max`" class="text-lg font-gothic">Максимальне значення:</label>
                <input :ref="'max'" :name="`${props.name}_max`" :id="`${props.name}_max`" :placeholder="props.max"
                    :value="!props.placeholder ? props.max : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_max" class="text-lg font-gothic">Колір максимального значення:</label>
                <input :ref="'color_max'" name="color_max" id="color_max" type="color" :value="props.colors[0]"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

            <section>
                <label :for="`${props.name}_value`" class="text-lg font-gothic">Нинішнє значення:</label>
                <input :ref="'value'" :name="`${props.name}_value`" :id="`${props.name}_value`"
                    :placeholder="props.value" :value="!props.placeholder ? props.value : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_mid" class="text-lg font-gothic">Колір значення посередині:</label>
                <input :ref="'color_mid'" name="color_mid" id="color_mid" type="color" :value="props.colors[1]"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

        </form>

        <section class="flex items-center justify-start mt-2 gap-4">
            <AprroveButtonWithText :text="!props.placeholder ? 'Редагувати' : 'Додати'" class="w-32 h-12 flex justify-center items-center"
                @click="addHealthField" />
            <RejectButtonWithText v-if="props.placeholder" text="Очистити" class="w-32 h-12 flex justify-center items-center"
                @click="resetFields" />
        </section>

    </div>

</template>