<script setup>
import { ref, computed } from 'vue';
import AprroveButtonWithText from '../reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '../reusable/Buttons/RejectButtonWithText.vue';
import ProgressiveBar from '../reusable/ProgressiveBar.vue';
import { HeartIcon } from '@heroicons/vue/24/solid';
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

const isNew = !props.health_field

const name = ref(props.health_field?.name ?? '')
const min = ref(props.health_field?.min ?? 0)
const max = ref(props.health_field?.max ?? 25)
const value = ref(props.health_field?.value ?? 0)
const color_max = ref(props.health_field?.colors?.[0] ?? '#3E5F44')
const color_mid = ref(props.health_field?.colors?.[1] ?? '#FABC3F')
const color_min = ref(props.health_field?.colors?.[2] ?? '#8E1616')

const previewColors = computed(() => [color_max.value, color_mid.value, color_min.value])

function saveHealthField() {

    if (!name.value) {
        notify({ message: 'Вкажіть назву поля', type: 'error' })
        return
    }
    if (min.value > max.value) {
        notify({ message: 'Мінімальне значення більше за максимальне', type: 'error' })
        return
    }
    if (value.value > max.value) {
        notify({ message: 'Нинішнє значення було встановлено на максимальне', type: 'warning' })
        value.value = max.value
    }

    const health = toHealthObjectField({
        name: name.value,
        min: min.value,
        max: max.value,
        value: value.value,
        colors: [color_max.value, color_mid.value, color_min.value],
        id: props.health_field?.id || null
    })

    props.callback(health)
    if (isNew) resetFields()
}

function resetFields() {
    name.value = ''
    min.value = 0
    max.value = 25
    value.value = 0
    color_max.value = '#3E5F44'
    color_mid.value = '#FABC3F'
    color_min.value = '#8E1616'
}

</script>

<template>
    <div class="rounded-xl border-2 p-4 space-y-3"
        :class="isNew ? 'border-orange-gold/50 bg-orange-gold/10' : 'border-greenish-mid/50 bg-greenish-dark/10'">

        <div class="flex items-center gap-2">
            <HeartIcon class="w-6 h-6 shrink-0" :class="isNew ? 'text-orange-gold' : 'text-greenish-mid'" />
            <span class="text-lg font-gothic font-medium truncate">{{ isNew ? 'Нове поле' : (name || props.label) }}</span>

            <RejectButtonWithText v-if="!isNew" text="Видалити"
                class="ml-auto h-9 px-3 shrink-0 flex justify-center items-center"
                @click="props.callback_remove(props.health_field)" />
        </div>

        <ProgressiveBar :value="Number(value) || 0" :valueMax="Number(max) || 1" :text="name || props.label"
            :colors="previewColors" />

        <form @submit.prevent class="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <label class="flex flex-col gap-1 col-span-full text-sm font-gothic">
                Назва поля
                <input v-model="name" placeholder="Назва" type="text"
                    class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray" />
            </label>

            <label class="flex flex-col gap-1 text-sm font-gothic">
                Мінімальне значення
                <div class="flex gap-1 items-center">
                    <input v-model="color_min" type="color"
                        class="w-9 h-9 shrink-0 cursor-pointer appearance-none overflow-hidden rounded-lg shadow-inner shadow-darkred-black">
                    <input v-model.number="min" placeholder="0" type="number"
                        class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray">
                </div>
            </label>

            <label class="flex flex-col gap-1 text-sm font-gothic">
                Нинішнє значення
                <div class="flex gap-1 items-center">
                    <input v-model="color_mid" type="color"
                        class="w-9 h-9 shrink-0 cursor-pointer appearance-none overflow-hidden rounded-lg shadow-inner shadow-darkred-black">
                    <input v-model.number="value" placeholder="0" type="number"
                        class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray">
                </div>
            </label>

            <label class="flex flex-col gap-1 text-sm font-gothic">
                Максимальне значення
                <div class="flex gap-1 items-center">
                    <input v-model="color_max" type="color"
                        class="w-9 h-9 shrink-0 cursor-pointer appearance-none overflow-hidden rounded-lg shadow-inner shadow-darkred-black">
                    <input v-model.number="max" placeholder="25" type="number"
                        class="p-2 border-2 text-md font-gothic border-darkred-light_gray rounded-lg text-darkred-dark w-full focus:border-darkred-gray">
                </div>
            </label>

        </form>

        <div class="flex items-center gap-4">
            <AprroveButtonWithText :text="isNew ? 'Додати' : 'Зберегти'"
                class="w-32 h-12 flex justify-center items-center" @click="saveHealthField" />

            <RejectButtonWithText v-if="isNew" text="Очистити" class="w-32 h-12 flex justify-center items-center"
                @click="resetFields" />
        </div>

    </div>
</template>
