<script setup>
const nameString = defineModel('nameString', { type: String, required: true, default: '' })
</script>

<template>
    <div class="relative">

        <input type="text" v-model="nameString" required id="session-name" name="session-name"
            autocomplete="session-name" placeholder="Введіть назву сесії" class="w-full px-4 py-2.5 rounded-lg bg-brand-surface text-brand-text border-2 border-brand-accent/60 
                font-gothic tracking-wide placeholder:text-brand-text/40 shadow-inner outline-none transition-all duration-200 
             focus:border-brand-accent-hover focus:ring-2 focus:ring-brand-accent-hover/40" />

    </div>
</template>