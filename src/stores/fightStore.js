import { defineStore } from 'pinia'
import { ref } from 'vue'

import RepositoryFactory from '@http/RepositoryFactory'
import { socket } from '@ws/webSocket'
import { asyncHandler } from '@utils/asyncHandler'
import { toNewFight } from '@utils/objects.dto'

export const useFightStore = defineStore('fight', () => {

    const fight = ref(null)
    const activeFightInfo = ref(null) // {id, name} | null - lightweight, drives the "Open Fight" entry point
    const isLoading = ref(true)

    // REST - lightweight check, doesn't require joining the fight itself
    async function checkActiveFight() {
        const [res, err] = await asyncHandler(
            RepositoryFactory.get('fight/active')
        )
        if (err) return
        activeFightInfo.value = res.data
    }

    // REST - admin fight library management (AdminFightEditor)
    async function listFights() {
        return asyncHandler(RepositoryFactory.get('fight'))
    }

    async function getFightById(id) {
        return asyncHandler(RepositoryFactory.getById('fight', id))
    }

    async function createFight(data) {
        return asyncHandler(RepositoryFactory.create('fight', data))
    }

    async function deleteFightById(id) {
        return asyncHandler(RepositoryFactory.delete('fight', id))
    }

    // WS - live battle state. fightId is only meaningful for the GM live
    // view (/admin/:sessionId/fight/:fightId/live) - it pins the join to that
    // exact fight instead of "whichever one happens to be flagged active",
    // so editing the board always targets the fight you actually navigated
    // to. Players never pass it: they only ever see the session's active fight.
    function joinFight(sessionId, fightId = null) {
        isLoading.value = true
        socket.emit('fight:join', { sessionId, fightId })
    }

    function leaveFight() {
        fight.value = null
    }

    // Admin-only - free positioning, no AP/path cost.
    function move(sessionId, fightId, targetType, targetId, tileId) {
        socket.emit('fight:move', { sessionId, fightId, targetType, targetId, tileId })
    }

    function adminUpdate(sessionId, fightId, ops) {
        socket.emit('fight:adminUpdate', { sessionId, fightId, ops })
    }

    function setActive(sessionId, fightId) {
        socket.emit('fight:setActive', { sessionId, fightId })
    }

    function deactivate(sessionId, fightId) {
        socket.emit('fight:deactivate', { sessionId, fightId })
    }

    function onFightJoin(data) {
        fight.value = data ? toNewFight(data) : null
        isLoading.value = false
    }

    function onFightUpdateNotify(data) {
        fight.value = data ? toNewFight(data) : null
    }

    function onSetActiveNotify(info) {
        activeFightInfo.value = info
    }

    socket.on('fight:join', onFightJoin)
    socket.on('fight:updateNotify', onFightUpdateNotify)
    socket.on('fight:setActiveNotify', onSetActiveNotify)

    return {
        fight,
        activeFightInfo,
        isLoading,
        checkActiveFight,
        listFights,
        getFightById,
        createFight,
        deleteFightById,
        joinFight,
        leaveFight,
        move,
        adminUpdate,
        setActive,
        deactivate
    }
})
