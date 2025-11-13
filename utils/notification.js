import { reactive } from 'vue'

export const notifications = reactive([])

export function notify({ message, type = 'info', duration = 4000 }) {
  const id = Date.now() + Math.random()
  notifications.push({ id, message, type })

  setTimeout(() => {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) notifications.splice(index, 1)
  }, duration)
}

export function clearNotifications() {
  notifications.splice(0, notifications.length)
}

export function removeNotification(id) {
  const index = notifications.findIndex(n => n.id === id)
  if (index !== -1) notifications.splice(index, 1)
}
