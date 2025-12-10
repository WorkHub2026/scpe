import { io } from "socket.io-client";

import type { Socket } from "socket.io-client";

let socket: Socket | undefined;

export const initSocket = () => {
  if (!socket) {
    socket = io("/", {
      path: "/api/socket/io",
    });
  }
  return socket;
};
