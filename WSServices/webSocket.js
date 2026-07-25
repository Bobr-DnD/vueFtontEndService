import { ref } from "vue";
import { io } from "socket.io-client";

const connected = ref(false)

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
});

export { socket, connected };