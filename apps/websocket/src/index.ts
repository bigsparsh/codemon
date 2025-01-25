import { Server } from "socket.io";
import express from "express";
import http from "http";
import * as pty from "node-pty";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const term = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });
  term.onData((data) => {
    socket.emit("terminal output", data);
  });
  term.write("ls\r");

  socket.on("terminal input", (data) => {
    term.write(data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3003, () => {
  console.log("Server running on port 3003");
});
