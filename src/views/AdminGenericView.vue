<script setup>
import { onMounted, onBeforeUnmount, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket, connected } from '@ws/webSocket';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import SideSladierSessionStatus from '@/components/reusable/SideSladierSessionStatus.vue';

const sessionId = useRoute().params.sessionId

const state = reactive({
    isLoading: true,
    charactersOnlineIds: []
})

let charactersIds = []

onMounted(async () => {

    socket.emit('session:join', sessionId, { role: 'admin' })

    const [res, err] = await asyncHandler(
        RepositoryFactory.getById('session', sessionId)
    )
    if (err) return
    charactersIds = res.data.characters.map(el => { return { id: el.id, name: el.name } })

    state.isLoading = false
})

onBeforeUnmount(() => {
    socket.emit('session:leave', sessionId)
    ['session:error', 'session:update'].forEach(e => socket.off(e))
})

socket.on('session:update', async (session) => {
    
    const room = session.room
    state.charactersOnlineIds = []

    if (room) {
        state.charactersOnlineIds = room.members.filter(el => el[1].role === 'user' && el[1].userId).map(el => el[1].userId)
    }
})

socket.on('error', async (message) => {
    console.log(message);
})


watch(connected, (isConnected) => {
    if (isConnected) socket.emit('session:join', sessionId, { role: 'admin' })
})

</script>

<template>
    <RouterView />

    <SideSladierSessionStatus v-if="!state.isLoading" :status="connected" :charactersIds="charactersIds"
        :charactersOnlineIds="state.charactersOnlineIds" class="fixed inset-0 top-16 pointer-events-none" @click.stop />

</template>