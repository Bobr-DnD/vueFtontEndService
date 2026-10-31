<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket, connected, reconnectCount } from '@ws/webSocket';
import { useSessionStore } from '@/stores/sessionStore';
import { useAuthStore } from '@/stores/authStore';
import { notify } from '@utils/notification';

import SideSladierSessionStatus from '@/components/reusable/SideSladierSessionStatus.vue';

const sessionId = useRoute().params.sessionId
const store = useSessionStore()
const authStore = useAuthStore()

function onRollDiceNotify({ message } = {}) {
    notify({ message: `🎲 ${message}`, type: 'info' })
}

onMounted(async () => {
    socket.emit('session:join', sessionId, { token: authStore.getToken(sessionId) })
    store.loadSession(sessionId)
    socket.on('character:rollDiceNotify', onRollDiceNotify)
})

onBeforeUnmount(() => {
    store.CloseWebsocketSession(sessionId)
    socket.off('character:rollDiceNotify', onRollDiceNotify)
})

watch(reconnectCount, () => {
    socket.emit('session:join', sessionId, { token: authStore.getToken(sessionId) })
    store.loadSession(sessionId)
})

</script>

<template>
    <RouterView />

    <SideSladierSessionStatus v-if="!store.isLoading" :status="connected" :charactersIds="store.charactersIds"
        :charactersOnlineIds="store.charactersOnlineIds" class="fixed inset-0 top-16 pointer-events-none" @click.stop />

</template>