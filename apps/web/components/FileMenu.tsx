"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaFile, FaFolder, FaJs } from "react-icons/fa";
import { Socket } from "socket.io-client";
import ExpandedFileMenu from "./ExpandedFileMenu";

const FileMenu = ({
  id,
  socket,
  setEditorLang,
}: {
  id: string;
  socket: Socket;
  setEditorLang: Dispatch<SetStateAction<string>>;
}) => {
  const [folderStructure, setFolderStructure] = useState<{
    files: string[];
    folders: string[];
  }>();
  const [expanded, setExpanded] = useState<
    Map<
      string,
      {
        files: string[];
        folders: string[];
      }
    >
  >();
  useEffect(() => {
    socket.on("files", (data: { files: string[]; folders: string[] }) => {
      setFolderStructure(data);
    });
    socket.on(
      "expand",
      (key: string, data: { files: string[]; folders: string[] }) => {
        if (key.split("/").length > 2) return;

        setExpanded((prev) => {
          const newExpanded = new Map(prev);
          newExpanded.set(key, data);
          return newExpanded;
        });
      },
    );
  }, [id, socket]);

  return (
    <div className="p-2 text-sm">
      {folderStructure?.folders.map((file) => (
        <div
          className="flex flex-col gap-1 even:bg-red-500 cursor-pointer"
          key={crypto.randomUUID()}
          onClick={() => {
            if (expanded?.get(file)) {
              expanded.delete(file);
              setExpanded(new Map(expanded));
              return;
            }
            socket.emit("expand files", id, file);
          }}
        >
          <div className="flex gap-2 cursor-pointer hover:bg-grian-800 p-1 rounded-md items-center">
            <FaFolder />
            {file}
          </div>
          {expanded?.get(file) && (
            <ExpandedFileMenu
              keyname={file}
              depth={1}
              content={expanded.get(file)!}
              id={id}
              socket={socket}
              setEditorLang={setEditorLang}
            />
          )}
        </div>
      ))}
      {folderStructure?.files.map((file) => (
        <div
          className="flex gap-2 cursor-pointer hover:bg-grian-800 p-1 rounded-md items-center"
          key={crypto.randomUUID()}
          onClick={(e) => {
            e.stopPropagation();
            setEditorLang(() => {
              switch (file.split(".").pop()) {
                case "js":
                  return "javascript";
                case "ts":
                  return "typescript";
                case "py":
                  return "python";
                case "html":
                  return "html";
                case "css":
                  return "css";
                case "json":
                  return "json";
                case "xml":
                  return "xml";
                case "md":
                  return "markdown";
                case "sh":
                  return "shell";
                default:
                  return "plaintext";
              }
            });
            socket.emit("open file", id, file);
          }}
        >
          {file.split(".").pop() === "js" ? <FaJs /> : <FaFile />}
          {file}
        </div>
      ))}
    </div>
  );
};

export default FileMenu;
