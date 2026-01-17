<script setup>
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import { ref } from 'vue';
import { toHealthObjectField } from '/utils/objects.dto';
import { notify } from '/utils/notification';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    health_field: {
        type: Object,
        default: null
    },
    callback: {
        type: Function,
        required: true
    },
    callback_remove: {
        type: Function,
        required: false
    }
})

const field_exists = ref(false)
const name = ref(0)
const min = ref(0)
const max = ref(0)
const value = ref(0)
const color_min = ref('#8e1616')
const color_max = ref('#3e5f44')
const color_mid = ref('#fabc3f')

if (props.health_field) field_exists.value = true

function addHealthField() {

    const value_parsed = parseInt(value.value.value)
    const max_parsed = parseInt(max.value.value)
    const min_parsed = parseInt(min.value.value)

    if (!name.value.value) {
        notify({ message: 'Вкажіть назву поля', type: 'error' })
        return
    }
    else if (min_parsed > max_parsed) {
        notify({ message: 'Мінімальне значення більше за максимальне', type: 'error' })
        return
    }
    else if (value_parsed > max_parsed) {
        notify({ message: 'Нинішнє значення було встановлено на максимальне', type: 'warning' })
        actual_value = max_parsed
        value.value.value = max.value.value
    }

    let health = {
        name: name.value.value,
        min: min_parsed,
        max: max_parsed,
        value: value_parsed,
        colors: [color_max.value.value, color_mid.value.value, color_min.value.value],
        id: props.health_field?.id || null
    }

    health = toHealthObjectField(health)

    if (!field_exists) resetFields()
    props.callback(health)
    resetFields()
}

function resetFields() {
    name.value.value = null
    min.value.value = null
    max.value.value = null
    value.value.value = null
    color_min.value.value = '#8e1616'
    color_max.value.value = '#3e5f44'
    color_mid.value.value = '#fabc3f'
}

</script>

<template>
    <div>
        <form @submit.prevent class="grid grid-cols-2 gap-2 items-start justify-center w-full">

            <section>
                <label :for="props.label" class="text-lg font-gothic">Назва поля:</label>
                <input ref="name" :name="props.label" :id="props.label" placeholder="Назва"
                    :value="field_exists ? props.health_field.name : ''" type="text"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>

            </section>

            <section>
                <label :for="`${props.label}_min`" class="text-lg font-gothic">Мінімальне значення:</label>
                <input ref="min" :name="`${props.label}_min`" :id="`${props.label}_min`" placeholder="0"
                    :value="field_exists ? props.health_field.min : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_min" class="text-lg font-gothic">Колір мінімального значення:</label>
                <input ref="color_min" name="color_min" id="color_min" type="color"
                    :value="field_exists ? props.health_field.colors[2] : '#8e1616'"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

            <section>
                <label :for="`${props.label}_max`" class="text-lg font-gothic">Максимальне значення:</label>
                <input ref="max" :name="`${props.label}_max`" :id="`${props.label}_max`" placeholder="25"
                    :value="field_exists ? props.health_field.max : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_max" class="text-lg font-gothic">Колір максимального значення:</label>
                <input ref="color_max" name="color_max" id="color_max" type="color"
                    :value="field_exists ? props.health_field.colors[0] : '#3e5f44'"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

            <section>
                <label :for="`${props.label}_value`" class="text-lg font-gothic">Нинішнє значення:</label>
                <input ref="value" :name="`${props.label}_value`" :id="`${props.label}_value`" placeholder="0"
                    :value="field_exists ? props.health_field.value : null" type="number"
                    class="p-1 border-4 text-lg font-gothic border-darkred-dark rounded-lg text-darkred-dark w-full">
            </section>

            <section>
                <label for="color_mid" class="text-lg font-gothic">Колір значення посередині:</label>
                <input ref="color_mid" name="color_mid" id="color_mid" type="color"
                    :value="field_exists ? props.health_field.colors[1] : '#fabc3f'"
                    class="w-full h-8 cursor-pointer appearance-none overflow-hidden shadow-inner shadow-darkred-black">
            </section>

        </form>

        <section class="flex items-center justify-start mt-2 gap-4">

            <AprroveButtonWithText :text="field_exists ? 'Зберегти' : 'Додати'"
                class="w-32 h-12 flex justify-center items-center" @click="addHealthField" />

            <RejectButtonWithText v-if="!field_exists" text="Очистити"
                class="w-32 h-12 flex justify-center items-center" @click="resetFields" />

            <RejectButtonWithText v-if="field_exists" text="Видалити" class="w-32 h-12 flex justify-center items-center"
                @click="props.callback_remove(props.health_field)" />
        </section>

    </div>

</template>