import { reactive } from 'vue'

const DEFAULT_DURATION = 3500

export const notifications = reactive([])

export function notify({ message, type = 'info', duration = DEFAULT_DURATION }) {
  const id = Date.now() + Math.random()
  notifications.push({ id, message, type })

  setTimeout(() => {
    removeNotification(id)
  }, duration)
}

export function notifySyncSuccess(duration = DEFAULT_DURATION / 2) {
  notify({ type: 'sync-success', duration })
}

export function clearNotifications() {
  notifications.splice(0, notifications.length)
}

export function removeNotification(id) {
  const index = notifications.findIndex(n => n.id === id)
  if (index !== -1) notifications.splice(index, 1)
}
