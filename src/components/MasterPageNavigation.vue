<script setup>
import { RouterLink, useRoute } from 'vue-router'

const id = useRoute().params.id


</script>

<template>
    <nav
        class="flex gap-8 px-6 py-4 bg-fallout-blackish border-b-2 border-fallout-red shadow-[0_0_25px_rgba(0,0,0,0.8)] font-gothic tracking-wide uppercase select-none">
        <RouterLink to="/"
            class="relative text-fallout-sand hover:text-fallout-red transition-colors duration-300
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
           after:bg-fallout-sand hover:after:bg-fallout-red hover:after:w-full after:transition-all after:duration-300">
            Головна сторінка
        </RouterLink>

        <RouterLink to="/sessions"
            class="relative text-fallout-sand hover:text-fallout-red transition-colors duration-300
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
           after:bg-fallout-sand hover:after:bg-fallout-red hover:after:w-full after:transition-all after:duration-300">
            Список Сесій
        </RouterLink>

        <hr class="w-1 h-6 bg-fallout-red border-0 mx-4 bg-gradient-to-r from-transparent via-fallout-red to-transparent rounded" />

        <RouterLink :to="'/admin/session/' + id" class="relative text-fallout-red font-semibold tracking-wide
           after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px]
           after:bg-fallout-red hover:after:w-full after:transition-[width] after:duration-400 after:ease-out">
            Сесія
        </RouterLink>
    </nav>
</template>

<style scope></style>