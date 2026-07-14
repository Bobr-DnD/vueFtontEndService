<script setup>
import { onMounted, onBeforeUnmount, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket, connected } from '@ws/webSocket';
import { useSessionStore } from '@/stores/sessionStore';

import SideSladierSessionStatus from '@/components/reusable/SideSladierSessionStatus.vue';

const sessionId = useRoute().params.sessionId

const store = useSessionStore()

onMounted(async () => {
    socket.emit('session:join', sessionId, { role: 'admin' })
    store.loadSession(sessionId)
})

onBeforeUnmount(() => {
    store.CloseWebsocketSession(sessionId)
})

watch(connected, (isConnected) => {
    if (isConnected) socket.emit('session:join', sessionId, { role: 'admin' })
})

</script>

<template>
    <RouterView />

    <SideSladierSessionStatus v-if="!store.isLoading" :status="connected" :charactersIds="store.charactersIds"
        :charactersOnlineIds="store.charactersOnlineIds" class="fixed inset-0 top-16 pointer-events-none" @click.stop />

</template>