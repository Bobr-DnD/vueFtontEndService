<script setup>
import { onMounted, onBeforeUnmount, reactive } from 'vue';
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
})

socket.on('session:update', async (session) => {

    console.log(session);

    state.charactersOnlineIds = []
    if (session.members) {
        state.charactersOnlineIds = session.members.filter(el => el[1].role === 'user' && el[1].userId).map(el => el[1].userId)
    }   
    
})

</script>

<template>
    <RouterView />

    <SideSladierSessionStatus v-if="!state.isLoading" :status="connected" :charactersIds="charactersIds"
        :charactersOnlineIds="state.charactersOnlineIds" class="fixed inset-0 top-16 pointer-events-none" @click.stop />

</template>