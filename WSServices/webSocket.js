import { ref } from "vue";
import { io } from "socket.io-client";
import { notify } from "@utils/notification";

// Socket.io itself only waits reconnectionDelay (1s) before retrying, so a
// disconnect shorter than this never surfaces a toast - only outages the
// user would actually notice do.
const DISCONNECT_NOTIFY_DELAY_MS = 1500

const connected = ref(false)
const reconnectCount = ref(0)

let disconnectNotifyTimer = null
let disconnectNotified = false
let hasConnectedOnce = false

const socket = io(import.meta.env.VITE_WS, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 2000,
  randomizationFactor: 0.5
});

function cancelPendingDisconnectNotification() {
  if (!disconnectNotifyTimer) return
  clearTimeout(disconnectNotifyTimer)
  disconnectNotifyTimer = null
}

socket.on("connect", () => {
  connected.value = true;
  console.log("Socket connected:", socket.id);

  cancelPendingDisconnectNotification()

  if (disconnectNotified) {
    notify({ message: "З'єднання з сервером відновлено", type: 'success' })
    disconnectNotified = false
  }

  // Every connect after the first is a reconnect - whether socket.io's own
  // backoff loop did it, or the forced connect() below (visibilitychange) -
  // both need the same session/character resync downstream.
  if (hasConnectedOnce) {
    reconnectCount.value++;
  }
  hasConnectedOnce = true;
});

socket.on("disconnect", (reason) => {
  connected.value = false;
  console.warn("Socket disconnected:", reason);

  if (disconnectNotifyTimer) return
  disconnectNotifyTimer = setTimeout(() => {
    disconnectNotifyTimer = null
    if (connected.value) return
    notify({ message: "З'єднання з сервером втрачено. Потрібно перезавантажити", type: 'error' })
    disconnectNotified = true
  }, DISCONNECT_NOTIFY_DELAY_MS)
});

socket.on("connect_error", (err) => {
  connected.value = false;
  console.warn("Socket connect_error:", err.message);
});

// Mobile browsers freeze JS timers while a tab is hidden (e.g. screen locked),
// so socket.io's own background retry loop can sit on a stale, frozen backoff
// timer for however long the screen was off. Forcing a connect() the instant
// the page is visible again is faster and more deterministic than waiting for
// that timer to resume - connect() is a safe no-op if already connected.
// (Deliberately not touching socket.io(false)/skipReconnect here - if that's
// toggled off while a reconnect attempt is already scheduled, the pending
// timer bails without resetting its own "reconnecting" flag, permanently
// stalling future automatic reconnects for the rest of the session.)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !socket.connected) {
    socket.connect();
  }
});

export { socket, connected, reconnectCount };