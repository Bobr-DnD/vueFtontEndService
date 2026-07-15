import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'

import { connected } from '@ws/webSocket';

export const useGameStore = defineStore('game', () => {

    const isBackendOffline = ref(false)
    const offlineTimeout = ref(null)

    const effects_hidden = reactive({})
    const currency_hidden = reactive({})
    const custom_hidden = reactive({})
    const custom_modal_hidden = reactive({})
    const openHealthIds = reactive({})

    watch(connected, (isConnected) => {
        if (isConnected) {
            if (offlineTimeout.value) {
                clearTimeout(offlineTimeout.value)
                offlineTimeout.value = null
            }
            isBackendOffline.value = false
        }
        else {
            if (!isBackendOffline.value) {
                offlineTimeout.value = setTimeout(() => {
                    isBackendOffline.value = true
                }, 30 * 1000)
            }
        }
    })

    function initCharacterUI(characterId) {
        if (!(characterId in effects_hidden)) effects_hidden[characterId] = true
        if (!(characterId in currency_hidden)) currency_hidden[characterId] = true
        if (!(characterId in custom_hidden)) custom_hidden[characterId] = true
        if (!(characterId in custom_modal_hidden)) custom_modal_hidden[characterId] = true
        if (!(characterId in openHealthIds)) openHealthIds[characterId] = new Set()
    }

    function toggleHealthId(characterId, healthId) {
        const ids = openHealthIds[characterId]
        if (ids.has(healthId)) {
            ids.delete(healthId)
        } else {
            ids.add(healthId)
        }
    }

    return {
        isBackendOffline,
        effects_hidden,
        currency_hidden,
        custom_hidden,
        custom_modal_hidden,
        openHealthIds,
        initCharacterUI,
        toggleHealthId,
    }
})