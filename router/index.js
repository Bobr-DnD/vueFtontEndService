import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@views/HomeView.vue";
import Sessions from "@views/Sessions.vue";
import NotFoundView from '@views/NotFoundView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/sessions',
            name: 'sessions',
            component: Sessions
        },
        {
            
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
});

export default router;