import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Sessions from "@/views/Sessions.vue";
import SessionView from "@/views/SessionView.vue";
import NotFoundView from '@/views/NotFoundView.vue'

import AdminPageView from "@/views/AdminPageView.vue";
import AdminSessionConfView from "@/views/AdminSessionConfView.vue";

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
            path: '/admin/:id',
            name: 'admin_panel',
            component: AdminPageView
        },
        {
            path: '/admin/session/:id',
            name: 'admin_session',
            component: AdminSessionConfView
        },
        {
            path: '/session/:id',
            name: 'session',
            component: SessionView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
});

export default router;