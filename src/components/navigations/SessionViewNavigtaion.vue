<script setup>
import { RouterLink, useRoute } from 'vue-router'

const sessionId = useRoute().params.sessionId

</script>

<template>
    <nav
        class="flex flex-wrap gap-8 px-6 py-4  bg-brand-base border-b-2 border-brand-accent shadow-[0_0_25px_rgba(0,0,0,0.8)] font-gothic tracking-wide uppercase select-none">

        <!-- <RouterLink to="/"
            class="relative text-brand-text md:hover:text-brand-accent-hover transition-colors duration-300
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
           after:bg-brand-surface-inverted md:hover:after:bg-brand-accent-hover md:hover:after:w-full after:transition-all after:duration-300">
            Головна сторінка
        </RouterLink> -->

        <RouterLink to="/"
            class="relative text-brand-text md:hover:text-brand-accent-hover transition-colors duration-300
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
           after:bg-brand-surface-inverted md:hover:after:bg-brand-accent-hover md:hover:after:w-full after:transition-all after:duration-300">
            Список Сесій
        </RouterLink>

        <hr
            class="w-1 h-6 bg-brand-accent-hover border-0 mx-4 bg-gradient-to-r from-transparent via-brand-accent-hover to-transparent rounded" />

        <RouterLink :to="'/session/' + sessionId" class="relative text-brand-accent-hover font-semibold tracking-wide
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px]
           after:bg-brand-accent-hover md:hover:after:w-full after:transition-[width] after:duration-400 after:ease-out">
            Список персонажів
        </RouterLink>
    </nav>

</template>

<style scope></style>