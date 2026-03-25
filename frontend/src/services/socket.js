import socket from "socket.io-client";

let socketInstance = null;

// Read access token from cookie (non-httpOnly)
const getAccessToken = () => {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? match[1] : null;
};

// Socket.IO connects directly to the backend (not through Vercel proxy,
// since Vercel doesn't support WebSocket proxying).
// We pass the token via the auth handshake instead of relying on cookies.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BASE_URL;

export const initializeSocket = (projectId) => {
  if (socketInstance) {
    socketInstance.disconnect();
  }

  const token = getAccessToken();

  socketInstance = socket(SOCKET_URL, {
    withCredentials: true,
    auth: { token },
    query: { projectId },
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const receiveMessage = (eventName, cb) => {
  if (socketInstance) {
    socketInstance.on(eventName, cb);
  }
};

export const sendMessage = (eventName, data) => {
  if (socketInstance) {
    socketInstance.emit(eventName, data);
  }
};
