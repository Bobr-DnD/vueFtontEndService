import { defineStore } from 'pinia'
import { ref, computed, watch, toRaw } from 'vue'
import { useRouter } from 'vue-router'

import RepositoryFactory from '@http/RepositoryFactory'
import { socket, connected } from '@ws/webSocket';
import { asyncHandler } from '@utils/asyncHandler';

import { notify } from '@utils/notification';
import { toNewSession } from '@utils/objects.dto';
import { checkEqualByKeys } from '@utils/entityHelper';


export const useSessionStore = defineStore('session', () => {

    const session = ref(null)
    const editedSession = ref(null)
    const isLoading = ref(true)
    const networkError = ref(false)
    const charactersOnlineIds = ref([])
    const charactersIds = ref([])
    const unsavedChanges = ref(false)
    const copied = ref(false)
    const router = useRouter()

    const keysToWatch = [
        'name',
        'image',
        'notes',
        'customFields',
        'entityTypes',
        'currencyTypes',
        'characteristicsList',
        'enemyTypes',
        'perkTypes',
        'loadoutsLimit',
    ]

    // API calls
    async function loadSession(sessionId) {
        isLoading.value = true

        const [res, err] = await asyncHandler(
            RepositoryFactory.getById('session', sessionId)
        )
        if (err) {
            networkError.value = true
            isLoading.value = false
            return
        }

        session.value = toNewSession(res.data)
        charactersIds.value = session.value.characters.map(el => { return { id: el.id, name: el.name } })

        copySession()
        isLoading.value = false
    }

    async function saveSession(sessionId) {
        const [res, err] = await asyncHandler(
            RepositoryFactory.update('session', sessionId, toRaw(editedSession.value))
        )
        if (err) if (err) {
            networkError.value = true
            isLoading.value = false
            return
        }

        session.value = toNewSession(res.data)
        copySession()

        socket.emit('session:updateDataNotify', res.data.id)
        notify({ message: 'Сесія оновлена', type: 'success' })

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
        router.push('/')
    }

    async function changePassword(sessionId, newPass, oldPass) {

        const [res, err] = await asyncHandler(
            RepositoryFactory.changepass('session', sessionId, { password: oldPass, passwordNew: newPass })
        )
        if (err) return

        if (res.data.success) notify({ message: res.data.message, type: 'success' })

    }

    // WS communication

    function CloseWebsocketSession(sessionId) {
        socket.emit('session:leave', sessionId)
        const events = ['session:error', 'session:update', 'session:updateDataNotify', 'disconnect']
        events.forEach(e => socket.off(e))
    }

    socket.on('session:updateDataNotify', (newSession) => {
        session.value = toNewSession(newSession)
        notify({ message: `Сесію ${newSession.name} було оновлено`, type: 'warning' })
    })

    socket.on('session:update', async (session) => {

        const room = session.room
        charactersOnlineIds.value = []

        if (room) {
            charactersOnlineIds.value = room.members.filter(el => el[1].role === 'user' && el[1].userId).map(el => el[1].userId)
        }
    })

    socket.on('error', async (message) => {
        console.log(message);
    })

    socket.on('disconnect', () => {
        charactersOnlineIds.value = []
    })

    //service functions
    function copySession() {
        copied.value = true
        editedSession.value = (structuredClone(toRaw(session.value)))
    }

    function markUnsaved() {
        unsavedChanges.value = true
    }

    function discardChanges() {
        copySession()
        unsavedChanges.value = false
        notify({ message: 'Зміни анульовані', type: 'warning' })
    }

    //mutation functions

    function changeImage(image) {
        editedSession.value.image = image
    }

    function addCustomField(object) {
        editedSession.value.customFields.push(object)
    }

    function removeCustomField(id) {
        editedSession.value.customFields = editedSession.value.customFields.filter(el => el.id !== id)
    }

    watch(() => editedSession.value, () => {

        if (copied.value) {
            copied.value = false
            return
        }

        if (checkEqualByKeys(session.value, editedSession.value, keysToWatch)) markUnsaved()

    }, { deep: true, immediate: false })

    return {
        session,
        editedSession,
        isLoading,
        unsavedChanges,
        charactersOnlineIds,
        charactersIds,
        networkError,
        loadSession,
        markUnsaved,
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