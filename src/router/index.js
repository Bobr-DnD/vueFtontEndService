import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminGenericView from "@/views/AdminGenericView.vue";
import SessionGenericView from "@/views/SessionGenericView.vue";
import Sessions from "@/views/SessionsView.vue";
import SessionView from "@/views/SingleSessionView.vue";
import NotFoundView from '@/components/reusable/NotFoundView.vue'
import CharacterPageView from "@/views/CharacterPageView.vue";
import CharacterPageEditor from "@/views/CharacterPageEditor.vue";
import EntitiesPageEditor from "@/views/EntitiesPageEditor.vue";
import SessionPageEditor from "@/views/SessionPageEditor.vue";
import EffectsPageEditor from "@/views/EffectsPageEditor.vue";
import PerksPageEditor from "@/views/PerksPageEditor.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: '/',
        //     name: 'home',
        //     component: HomeView
        // },
        {
            path: '/',
            name: 'sessions',
            component: Sessions
        },
        {
            path: '/admin/:sessionId',
            name: 'admin',
            component: AdminGenericView,
            children:[
                {
                    path: '',
                    name: 'session_editor',
                    component: SessionPageEditor
                },
                {
                    path: 'characters',
                    name: 'characters_editor',
                    component: CharacterPageEditor
                },
                {
                    path: 'entities',
                    name: 'entities_editor',
                    component: EntitiesPageEditor
                },
                {
                    path: 'effects',
                    name: 'effects_editor',
                    component: EffectsPageEditor
                },
                {
                    path: 'perks',
                    name: 'perks_editor',
                    component: PerksPageEditor
                }
            ]
        },
        {
            path: '/session/:sessionId',
            name: 'session',
            component: SessionGenericView,
            children: [
                {
                    path: '',
                    name: 'session_characters',
                    component: SessionView
                },
                {
                    path: 'character/:characterId',
                    name: 'session_character_view',
                    component: CharacterPageView
                }
            ]
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
});

export default router;