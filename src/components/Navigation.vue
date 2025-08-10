<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <nav
        class="flex gap-8 px-6 py-4 bg-fallout-blackish border-b-2 border-fallout-red shadow-[0_0_25px_rgba(0,0,0,0.8)] font-gothic tracking-wide uppercase">
        <RouterLink to="/"
            class="relative text-fallout-sand hover:text-fallout-red transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-fallout-sand hover:after:bg-fallout-red hover:after:w-full after:transition-all after:duration-300">
            Головна сторінка
        </RouterLink>

        <RouterLink to="/sessions"
            class="relative text-fallout-sand hover:text-fallout-red transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-fallout-sand hover:after:bg-fallout-red hover:after:w-full after:transition-all after:duration-300">
            Список сесій
        </RouterLink>
    </nav>

</template>

<style scope></style>