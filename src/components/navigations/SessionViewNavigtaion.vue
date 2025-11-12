<script setup>
import { RouterLink, useRoute } from 'vue-router'

const sessionId = useRoute().params.sessionId

</script>

<template>
    <nav
        class="flex flex-wrap gap-8 px-6 py-4  bg-darkred-dark border-b-2 border-darkred-red shadow-[0_0_25px_rgba(0,0,0,0.8)] font-gothic tracking-wide uppercase select-none">

        <RouterLink to="/"
            class="relative text-darkred-light md:hover:text-darkred-bright transition-colors duration-300
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
           after:bg-darkred-light md:hover:after:bg-darkred-bright md:hover:after:w-full after:transition-all after:duration-300">
            Головна сторінка
        </RouterLink>

        <RouterLink to="/sessions"
            class="relative text-darkred-light md:hover:text-darkred-bright transition-colors duration-300
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
           after:bg-darkred-light md:hover:after:bg-darkred-bright md:hover:after:w-full after:transition-all after:duration-300">
            Список Сесій
        </RouterLink>

        <hr
            class="w-1 h-6 bg-darkred-bright border-0 mx-4 bg-gradient-to-r from-transparent via-darkred-bright to-transparent rounded" />

        <RouterLink :to="'/session/' + sessionId" class="relative text-darkred-bright font-semibold tracking-wide
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px]
           after:bg-darkred-bright md:hover:after:w-full after:transition-[width] after:duration-400 after:ease-out">
            Список персонажів
        </RouterLink>
    </nav>

</template>

<style scope></style>