import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'session_tokens'

function loadTokens() {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}
    } catch {
        return {}
    }
}

function persistTokens(tokens) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    } catch {
        // sessionStorage unavailable (private mode, etc.) - tokens stay in-memory only
    }
}

function decodePayload(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

const ROLE_RANK = { user: 1, admin: 2 }

export const useAuthStore = defineStore('auth', () => {
    const tokens = ref(loadTokens())

    // Never let a freshly issued lower-privilege token (e.g. a 'user' login)
    // replace an already-held higher-privilege one for the same session -
    // once you're admin for a session, you stay admin until you log out of it.
    function setToken(sessionId, token) {
        const incomingRole = decodePayload(token)?.role
        const existingRole = getRole(sessionId)

        if (existingRole && (ROLE_RANK[existingRole] ?? 0) > (ROLE_RANK[incomingRole] ?? 0)) {
            return
        }

        tokens.value[sessionId] = token
        persistTokens(tokens.value)
    }

    function clearToken(sessionId) {
        delete tokens.value[sessionId]
        persistTokens(tokens.value)
    }

    function getToken(sessionId) {
        const token = tokens.value[sessionId]
        if (!token) return null

        const payload = decodePayload(token)
        if (!payload?.exp || payload.exp * 1000 <= Date.now()) {
            clearToken(sessionId)
            return null
        }

        return token
    }

    function getRole(sessionId) {
        const token = getToken(sessionId)
        return token ? decodePayload(token)?.role ?? null : null
    }

    function hasRole(sessionId, role) {
        const actual = getRole(sessionId)
        if (!actual) return false
        return actual === role || actual === 'admin'
    }

    return {
        setToken,
        clearToken,
        getToken,
        getRole,
        hasRole
    }
})
