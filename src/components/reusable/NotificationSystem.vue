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
    <div class="fixed top-4 right-4 flex flex-col gap-2 z-50 max-w-sm w-full pointer-events-none select-none">
        <transition-group name="fade" tag="div" class="space-y-1">
            <div v-for="n in notifications" :key="n.id" :class="[
                'rounded-lg p-4 shadow-lg border-2 font-univers text-base pointer-events-auto',
                'bg-darkred-dark text-darkred-light text-lg font-gothic border-4 rounded-lg',
                'transition-all duration-300 backdrop-blur-md',
                'grid grid-cols-[1fr_40px]',
                typeStyles[n.type] || typeStyles.info
            ]">

                <div class="flex flex-col gap-2 w-full">
                    <div>
                        {{ typeMessage[n.type] || typeMessage.info }}
                    </div>
                    <div>
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
