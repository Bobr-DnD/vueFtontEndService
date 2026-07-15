<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket, connected } from '@ws/webSocket';
import { useSessionStore } from '@/stores/sessionStore';
import {useGameStore } from '@/stores/gameStore';


const sessionId = useRoute().params.sessionId
const sessionStore = useSessionStore()
const gameStore = useGameStore()

onMounted(() => {
    socket.emit('session:join', sessionId, { role: 'user' })
    sessionStore.loadSession(sessionId)
})

watch(
    () => sessionStore.isLoading,
    (isLoading) => {
        if (isLoading) return
        sessionStore.session.characters.forEach(el => gameStore.initCharacterUI(el.id))
    }
)

onBeforeUnmount(() => {
    sessionStore.CloseWebsocketSession(sessionId)
})

watch(connected, (isConnected) => {
    if (isConnected) socket.emit('session:join', sessionId, { role: 'user' })
})

</script>

<template>
    <RouterView />
</template>