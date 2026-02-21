<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import RepositoryFactory from '@http/RepositoryFactory';
import { useRoute } from 'vue-router';
import { socket, connected } from '@ws/webSocket';

const sessionId = useRoute().params.sessionId

onMounted(() => {
    socket.emit('session:join', sessionId, { role: 'user' })
})

onBeforeUnmount(() => {
    socket.emit('session:leave', sessionId)
})

watch(connected, (isConnected) => {
    if (isConnected) socket.emit('session:join', sessionId, { role: 'user' })
})

</script>

<template>
    <RouterView />
</template>