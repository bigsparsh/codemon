import { Socket } from "socket.io";

export class User {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }
}
