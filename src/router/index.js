import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Sessions from "@/views/SessionsView.vue";
import SessionView from "@/views/SingleSessionView.vue";
import NotFoundView from '@/components/reusable/NotFoundView.vue'
import CharacterPageView from "@/views/CharacterPageView.vue";
import CharacterPageEditor from "@/views/CharacterPageEditor.vue";
import EntitiesPageEditor from "@/views/EntitiesPageEditor.vue";

import AdminPageView from "@/views/AdminPageView.vue";

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
            path: '/admin/:sessionId',
            name: 'admin_panel',
            component: AdminPageView
        },
        {
            path: '/admin/:sessionId/entities',
            name: 'admin_session',
            component: EntitiesPageEditor
        },
        {
            path: '/admin/:sessionId/characters',
            name: 'session_characters_editor',
            component: CharacterPageEditor
        },
        {
            path: '/session/:sessionId',
            name: 'session',
            component: SessionView
        },
        {
            path: '/session/:sessionId/character/:characterId',
            name: 'session_character',
            component: CharacterPageView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
});

export default router;