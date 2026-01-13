<script setup>
import { notifications, removeNotification } from '/utils/notification'
import CloseButtonRedBG from './Buttons/CloseButtonRedBG.vue'

const typeStyles = {
    success: 'border-greenish-dark',
    error: 'border-darkred-red',
    warning: 'border-orange-orange/90',
    info: 'border-darkred-gray'
}

const typeMessage = {
    success: 'Успіх',
    error: 'Помилка',
    warning: 'Попередження',
    info: 'Повідомлення'
}

</script>

<template>
    <div
        class="fixed top-3 right-3 left-3 z-50 flex flex-col gap-2 pointer-events-none select-none sm:left-auto sm:w-80">

        <transition-group name="fade" tag="div" class="space-y-2">

            <div v-for="n in notifications" :key="n.id" :class="[
                'pointer-events-auto rounded-xl p-4 shadow-xl border-2',
                'bg-darkred-dark text-darkred-light font-gothic text-base',
                'backdrop-blur-md transition-all duration-300',
                'grid grid-cols-[1fr_36px] gap-3 items-center',
                typeStyles[n.type] || typeStyles.info
            ]">

                <div class="flex flex-col gap-1 w-full">
                    <div class="text-lg font-semibold">
                        {{ typeMessage[n.type] || typeMessage.info }}
                    </div>

                    <div class="text-base leading-snug break-words">
                        {{ n.message }}
                    </div>
                </div>

                <CloseButtonRedBG @click="removeNotification(n.id)" />

            </div>

        </transition-group>
    </div>

</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s, transform 0.4s;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
