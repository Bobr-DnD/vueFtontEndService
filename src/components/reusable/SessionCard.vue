<script setup>
import { ref, toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@utils/notification'
import RepositoryFactory from '@http/RepositoryFactory'
import { asyncHandler } from '@utils/asyncHandler'
import { useAuthStore } from '@/stores/authStore'

import InputPassword from './Inputs/InputPassword.vue'

const pass = ref('')
const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        deafult: null
    },
    id: {
        type: String,
        required: true
    }
})

const mode = ref('гравець')
const role = ref('user')

const alreadyAuthed = computed(() => authStore.hasRole(props.id, role.value))

function toggleMode() {
    if (mode.value === 'гравець') {
        role.value = 'admin'
        mode.value = 'майстер'
    }
    else {
        role.value = 'user'
        mode.value = 'гравець'
    }
}

function enterSession() {
    router.push(role.value === 'admin' ? `/admin/${props.id}` : `/session/${props.id}`)
}

async function sessionLogin() {
    if (alreadyAuthed.value) {
        enterSession()
        return
    }

    const password = toRaw(pass.value)
    if (password) {
        const [res, err] = await asyncHandler(
            RepositoryFactory.login('session', props.id, { password, role: role.value })
        )
        if (err) return

        if (res.data.success) {
            authStore.setToken(props.id, res.data.token)
            enterSession()
        }

    }
    else {
        notify({ message: 'Введіть пароль', type: 'error' })
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-lg">
        <div
            class="max-w-sm w-full rounded-xl shadow-lg overflow-hidden border-4 border-darkred-red bg-darkred-dark">
            <div class="relative">

                <img class="w-full h-96 object-cover object-top border-darkred-light"
                    :src="props.image ? props.image : 'https://placehold.co/400x400?text=Session'"
                    alt="Session image" />

                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent pointer-events-none">
                </div>

            </div>

            <div class="p-4 space-y-4 text-darkred-light">
                <h2 class="text-2xl tracking-wide text-center text-darkred-light font-gothic drop-shadow-md">
                    {{ props.name }}
                </h2>

                <form v-if="!alreadyAuthed" @submit.prevent="sessionLogin">
                    <InputPassword v-model:passString="pass" />
                </form>

                <button @click="toggleMode"
                    class="w-full text-md font-medium font-gothic py-2 px-3 rounded-lg bg-darkred-red md:hover:bg-darkred-bright transition-colors  tracking-wide shadow-md">
                    Режим: <span class="capitalize">{{ mode }}</span>
                </button>

                <div @click="sessionLogin"
                    class="w-full text-lg font-medium font-gothic cursor-pointer inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-darkred-red md:hover:bg-darkred-bright active:bg-darkred-dark text-white tracking-wide shadow-lg transition-all duration-200 ease-in-out">
                    {{ alreadyAuthed ? 'Продовжити' : 'Зайти' }}
                </div>
            </div>
        </div>
    </div>


</template>