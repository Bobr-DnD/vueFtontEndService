<script setup>
import { useDesktopOnly } from '@utils/useDesktopOnly'

const { isDesktop } = useDesktopOnly()
</script>

<template>
    <slot v-if="isDesktop" />

    <div v-else class="w-full min-h-screen flex items-center justify-center p-8 text-center font-gothic text-darkred-light bg-darkred-dark">
        <div class="max-w-md space-y-4">
            <div class="text-5xl">🖥️</div>
            <h1 class="text-2xl font-semibold">Відкрийте цю сторінку на більшому екрані</h1>
            <p class="text-darkred-light_gray">Бойова карта поки не адаптована під телефони та маленькі екрани. Скористайтесь планшетом або комп'ютером.</p>
        </div>
    </div>
</template>
