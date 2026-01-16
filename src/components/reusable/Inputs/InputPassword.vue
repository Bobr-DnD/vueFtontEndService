<script setup>
import { computed, ref } from 'vue';

import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

const passString = defineModel('passString', { type: String, required: true, default: '' })

const props = defineProps({
    confirm: {
        type: Boolean,
        default: false
    },
    new: {
        type: Boolean,
        default: false
    }
})

const showPassword = ref(false);

const inputConfig = computed(() => {
    if (props.new) {
        return {
            id: 'new-password',
            name: 'new-password',
            autocomplete: 'new-password',
            placeholder: 'Введіть новий пароль',
            minlength: 8
        }
    }

    if (props.confirm) {
        return {
            id: 'confirm-password',
            name: 'confirm-password',
            autocomplete: 'confirm-password',
            placeholder: 'Підтвердіть пароль',
            minlength: 8
        }
    }

    return {
        id: 'current-password',
        name: 'current-password',
        autocomplete: 'current-password',
        placeholder: 'Введіть пароль',
    }
})

function togglePassword() {
    showPassword.value = !showPassword.value;
}

</script>

<template>

    <div class="relative">
        <form @submit.prevent action="">

            <input :type="showPassword ? 'text' : 'password'" v-model="passString" minlength="8" required
                v-bind="inputConfig" class="w-full px-4 py-2.5 rounded-lg bg-darkred-dark_gray text-darkred-light border-2 border-darkred-red/60 
                font-gothic tracking-wide placeholder:text-darkred-light/40 shadow-inner outline-none transition-all duration-200 
             focus:border-darkred-bright focus:ring-2 focus:ring-darkred-bright/40" />

            <div @mousedown.prevent @click="togglePassword"
                class="absolute right-3 top-[25%] text-darkred-light/80 hover:text-darkred-light cursor-pointer transition-colors">
                
                <EyeIcon v-if="showPassword" class="w-6 " />

                <EyeSlashIcon v-if="!showPassword" class="w-6" />

            </div>
        </form>

    </div>

</template>