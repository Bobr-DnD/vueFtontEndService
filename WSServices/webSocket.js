import { ref } from "vue";
import { io } from "socket.io-client";
import { notify } from "@utils/notification";


const connected = ref(false)
const reconnectCount = ref(0)

const socket = io(import.meta.env.VITE_WS, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 2000,
  randomizationFactor: 0.5
});

socket.on("connect", () => {
  connected.value = true;
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  connected.value = false;
  console.warn("Socket disconnected:", reason);
  notify({message: "З'єднання з сервером втрачено. Потрібно перезавантажити", type: 'error'})
});

socket.on("connect_error", (err) => {
  connected.value = false;
  console.warn("Socket connect_error:", err.message);
});

socket.io.on('reconnect', (attempt) => {
  reconnectCount.value++;
  console.warn("Socket reconnected, attempt:", attempt);
  notify({message: "З'єднання з сервером відновлено", type: 'success'})
});

export { socket, connected, reconnectCount };