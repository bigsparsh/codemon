import { Socket } from "socket.io";
import * as pty from "node-pty";
import { createFolder, listObjectsInFolder, ProjectType } from "./Storage";
import { createLocalFolder, openLocalFile } from "./Local";

export class User {
  socket: Socket;
  terminal: pty.IPty;
  lord_id: string;
  static instances: Map<Socket, User> = new Map();

  constructor(socket: Socket, lord_id: string) {
    this.socket = socket;
    this.lord_id = lord_id;
    this.terminal = pty.spawn("bash", [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });
    this.init();
  }

  async init() {
    await createFolder(this.lord_id, ProjectType.NODE);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await listObjectsInFolder(this.lord_id, true, this.socket);
    await createLocalFolder("demo-r2/nodejs/", this.lord_id);
    this.terminal.write(`cd /tmp/project/${this.lord_id}\r`);
    this.attach_handlers();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const content = await openLocalFile("index.js", this.lord_id);
    this.socket.emit("file content", content);
  }

  attach_handlers() {
    this.terminal.onData((data) => {
      this.socket.emit("terminal output", data);
    });
  }

  twrite(data: string) {
    this.terminal.write(data);
  }

  static remove_instance(socket: Socket) {
    User.instances.delete(socket);
  }
}
