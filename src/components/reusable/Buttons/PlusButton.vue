<script setup>
import { Plus } from 'lucide-vue-next';
</script>

<template>
    <button class="w-11 h-11 flex justify-center items-center text-brand-ink bg-brand-subtle border-4 border-brand-base rounded-lg
           md:hover:bg-brand-muted relative">
        <Plus class="w-8 h-8 transition-transform duration-300 group-md:hover:rotate-90" />
    </button>
</template>