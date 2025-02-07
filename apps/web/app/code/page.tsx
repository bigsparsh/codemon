"use client";

import { Editor } from "@monaco-editor/react";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "@xterm/xterm/css/xterm.css";
import FileMenu from "../../components/FileMenu";

const CodePage = () => {
  const [socket, setSocket] = useState<Socket>();
  const [id, setId] = useState<string>();
  const termWindow = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState<string>();
  const [editorLang, setEditorLang] = useState<string>("javascript");

  useEffect(() => {
    const ind = crypto.randomUUID();
    setId(ind);
    const wss = io("ws://localhost:3003");
    wss.on("connect", () => {
      wss.emit("send info", ind);
      wss.on("file content", (data: string) => {
        setEditorContent(data);
      });
    });
    setSocket(wss);

    const init = async () => {
      const { FitAddon } = await import("@xterm/addon-fit");
      const terminal = new Terminal({
        fontSize: 15,
        theme: {
          background: "#021c0e",
        },
      });
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(termWindow.current!);
      fitAddon.fit();

      terminal.onData((data) => {
        wss.emit("terminal input", data);
      });
      wss.on("terminal output", (data: string) => {
        console.log("Data: ", data);
        terminal.write(data);
      });
    };

    init();
  }, []);

  return (
    <div className="bg-grian-900 h-screen flex flex-col p-2 gap-2">
      <div className="p-2 bg-grian-950 rounded-xl text-sm">{id}</div>
      <div className="flex h-full gap-2">
        <div className="basis-1/6 bg-grian-950 rounded-xl">
          {id && socket && (
            <FileMenu id={id} socket={socket} setEditorLang={setEditorLang} />
          )}
        </div>
        <div className="basis-3/6 bg-grian-950 rounded-xl overflow-clip">
          {
            <Editor
              language={editorLang}
              value={editorContent}
              theme="vs-dark"
              options={{
                fontSize: 18,
                minimap: {
                  enabled: false,
                },
                padding: {
                  top: 10,
                },
              }}
            />
          }
        </div>
        <div className="flex flex-col basis-2/6 gap-2">
          <div className="rounded-xl bg-grian-950 basis-2/3"></div>
          <div
            className="rounded-xl p-1 bg-grian-950 basis-1/3 relative overflow-y-auto "
            ref={termWindow}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default CodePage;
