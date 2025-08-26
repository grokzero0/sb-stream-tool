import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types.js";

export function setupSocketio() {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(
    20242,
    // TODO: set CORS to not be wildcard?
    { cors: { origin: "*" } }
  );
  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.on("sendDataToServer", (data) => {
      console.log(`User ${socket.id} sending data to scoreboard`);
      socket.broadcast.emit("newData", data);
    });
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected, goodby`);
    });
  });
}
