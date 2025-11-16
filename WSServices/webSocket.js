import { io } from "socket.io-client";


const socket = io(import.meta.env.VITE_WS, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
});

export default socket;