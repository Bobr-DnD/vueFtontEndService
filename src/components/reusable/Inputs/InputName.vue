<script setup>
const nameString = defineModel('nameString', { type: String, required: true, default: '' })
</script>

<template>
    <div class="relative">
        <form @submit.prevent action="">

            <input type="text" v-model="nameString" required id="session-name" name="session-name"
                autocomplete="session-name" placeholder="Введіть назву сесії" class="w-full px-4 py-2.5 rounded-lg bg-darkred-dark_gray text-darkred-light border-2 border-darkred-red/60 
                font-gothic tracking-wide placeholder:text-darkred-light/40 shadow-inner outline-none transition-all duration-200 
             focus:border-darkred-bright focus:ring-2 focus:ring-darkred-bright/40" />
        </form>

    </div>
</template>