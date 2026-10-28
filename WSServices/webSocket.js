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

socket.io.on('reconnect', (attempt) => {
  reconnectCount.value++;
  console.warn("Socket reconnected, attempt:", attempt);
});

export { socket, connected, reconnectCount };