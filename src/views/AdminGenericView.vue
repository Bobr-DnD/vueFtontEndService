<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { socket } from '@ws/webSocket';

const sessionId = useRoute().params.sessionId

onMounted(() => {
    socket.emit('session:join', sessionId, { role: 'admin' })
})

onBeforeUnmount(() => {
    socket.emit('session:leave', sessionId)
})
</script>

<template>
    <RouterView />
</template>