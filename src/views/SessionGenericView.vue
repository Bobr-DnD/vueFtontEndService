<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket, reconnectCount } from '@ws/webSocket';
import { useSessionStore } from '@/stores/sessionStore';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';


const sessionId = useRoute().params.sessionId
const sessionStore = useSessionStore()
const gameStore = useGameStore()
const authStore = useAuthStore()

onMounted(() => {
    socket.emit('session:join', sessionId, { token: authStore.getToken(sessionId) })
    sessionStore.loadSession(sessionId)
})

watch(
    () => sessionStore.session,
    (session) => {
        if (!session) return
        session.characters.forEach(el => gameStore.initCharacterUI(el.id))
    },
    { immediate: true }
)

onBeforeUnmount(() => {
    sessionStore.CloseWebsocketSession(sessionId)
})

watch(reconnectCount, () => {
    socket.emit('session:join', sessionId, { token: authStore.getToken(sessionId) })
    sessionStore.loadSession(sessionId)
})

</script>

<template>
    <RouterView />
</template>