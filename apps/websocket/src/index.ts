import { Server } from "socket.io";
import express from "express";
import http from "http";
import { User } from "./User";
import { deleteEverything, expandFolder, getFileContent } from "./Storage";
import { openLocalFile } from "./Local";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // Get the details of a code repl session
  socket.on("send info", (lord_id) => {
    User.instances.set(socket, new User(socket, lord_id));
  });

  socket.on("open file", async (lord_id: string, file_name: string) => {
    const content = await openLocalFile(file_name, lord_id);
    socket.emit("file content", content);
  });

  // Handle terminal input
  socket.on("terminal input", (data) => {
    User.instances.get(socket)?.twrite(data);
  });

  socket.on("expand files", async (lord_id, fname) => {
    socket.emit("expand", fname, await expandFolder(fname, lord_id));
  });

  socket.on("delete everything", async () => {
    deleteEverything();
  });

  socket.on("file content", async (file_name: string, lord_id: string) => {
    await getFileContent(file_name, lord_id);
  });

  socket.on("disconnect", () => {
    User.remove_instance(socket);
  });
});

server.listen(3003, () => {
  console.log("Server running on port 3003");
});
