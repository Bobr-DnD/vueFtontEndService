import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import { useRouter } from 'vue-router'

import RepositoryFactory from '@http/RepositoryFactory'
import { socket, connected } from '@ws/webSocket';
import { asyncHandler } from '@utils/asyncHandler';
import { useAuthStore } from '@/stores/authStore';

import { notifySyncSuccess, notify } from '@utils/notification';
import { toNewSession } from '@utils/objects.dto';


export const useSessionStore = defineStore('session', () => {

    const authStore = useAuthStore()
    const session = ref(null)
    const editedSession = ref(null)
    const isLoading = ref(true)
    const networkError = ref(false)
    const charactersOnlineIds = ref([])
    const charactersIds = ref([])
    const unsavedChanges = ref(false)
    const dirtyFields = ref(new Set())
    const router = useRouter()

    // API calls
    async function loadSession(sessionId) {
        // A reconnect re-fetches the same session to resync state after a drop
        // (e.g. phone screen lock) - that should happen quietly in the background,
        // not re-trigger the full-page loader when we already have data to show.
        const isFreshSession = session.value?.id !== sessionId
        if (isFreshSession) isLoading.value = true

        const [res, err] = await asyncHandler(
            RepositoryFactory.getById('session', sessionId)
        )
        if (err) {
            networkError.value = true
            if (isFreshSession) isLoading.value = false
            return
        }

        session.value = toNewSession(res.data)
        charactersIds.value = session.value.characters.map(el => { return { id: el.id, name: el.name } })

        copySession()
        if (isFreshSession) isLoading.value = false
    }

    async function saveSession(sessionId) {
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('session', sessionId, buildOps())
        )
        if (err) if (err) {
            networkError.value = true
            isLoading.value = false
            return
        }

        session.value = toNewSession(res.data)
        copySession()

        socket.emit('session:updateDataNotify', res.data.id)
        unsavedChanges.value = false
    }

    async function deleteSession(sessionId) {

        const confirmSwitch = confirm('Видалити сесію?')
        if (!confirmSwitch) return

        const [res, err] = await asyncHandler(
            RepositoryFactory.delete('session', sessionId)
        )
        if (err) return

        else if (res.data.status) notify({ message: 'Сесію видалено', type: 'success' })
        CloseWebsocketSession(sessionId)
        authStore.clearToken(sessionId)
        router.push('/')
    }

    async function changePassword(sessionId, newPass, oldPass, field = 'password') {

        const [res, err] = await asyncHandler(
            RepositoryFactory.changepass('session', sessionId, { password: oldPass, passwordNew: newPass, field })
        )
        if (err) return

        if (res.data.success) notify({ message: res.data.message, type: 'success' })

    }

    // WS communication

    function CloseWebsocketSession(sessionId) {
        socket.emit('session:leave', sessionId)
        socket.off('session:updateDataNotify', onSessionUpdateDataNotify)
        socket.off('session:update', onSessionUpdate)
        socket.off('error', onSocketError)
        socket.off('disconnect', onSocketDisconnect)
    }

    function onSessionUpdateDataNotify(newSession) {
        session.value = toNewSession(newSession)
        notifySyncSuccess()
    }

    function onSessionUpdate(session) {
        const room = session.room
        charactersOnlineIds.value = []

        if (room) {
            // "online" means a character is actively connected - the viewer's
            // own role doesn't matter, since an admin can open a character page
            // too (the router lets an admin token satisfy a /session/ route).
            charactersOnlineIds.value = room.members.filter(el => el[1].userId).map(el => el[1].userId)
        }
    }

    function onSocketError(message) {
        console.warn(message);
        notify({message: message, type: 'error'})
    }

    function onSocketDisconnect() {
        charactersOnlineIds.value = []
    }

    socket.on('session:updateDataNotify', onSessionUpdateDataNotify)
    socket.on('session:update', onSessionUpdate)
    socket.on('error', onSocketError)
    socket.on('disconnect', onSocketDisconnect)

    //service functions
    function copySession() {
        editedSession.value = (structuredClone(toRaw(session.value)))
        dirtyFields.value = new Set()
    }

    function markUnsaved() {
        unsavedChanges.value = true
    }

    function markDirty(field) {
        dirtyFields.value.add(field)
        markUnsaved()
    }

    function buildOps() {
        return [...dirtyFields.value].map(field => ({
            op: 'replace',
            path: `/${field}`,
            value: toRaw(editedSession.value)[field]
        }))
    }

    function discardChanges() {
        copySession()
        unsavedChanges.value = false
        notify({ message: 'Зміни анульовані', type: 'warning' })
    }

    //mutation functions

    function changeImage(image) {
        editedSession.value.image = image
        markDirty('image')
    }

    function addCustomField(object) {
        editedSession.value.customFields.push(object)
        markDirty('customFields')
    }

    function removeCustomField(id) {
        editedSession.value.customFields = editedSession.value.customFields.filter(el => el.id !== id)
        markDirty('customFields')
    }

    return {
        session,
        editedSession,
        isLoading,
        unsavedChanges,
        dirtyFields,
        charactersOnlineIds,
        charactersIds,
        networkError,
        loadSession,
        markUnsaved,
        markDirty,
        saveSession,
        deleteSession,
        changePassword,
        discardChanges,
        changeImage,
        addCustomField,
        removeCustomField,
        CloseWebsocketSession
    }

})