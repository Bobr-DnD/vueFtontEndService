import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiUrl = import.meta.env.VITE_API

function currentSessionIdFromPath() {
    const match = window.location.pathname.match(/^\/(?:admin|session)\/([^/]+)/)
    return match ? match[1] : null
}

const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: false,
    headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

instance.interceptors.request.use((config) => {
    const sessionId = currentSessionIdFromPath()
    const token = sessionId ? useAuthStore().getToken(sessionId) : null

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const sessionId = currentSessionIdFromPath()
            if (sessionId) useAuthStore().clearToken(sessionId)
        }
        return Promise.reject(error)
    }
)

export default instance