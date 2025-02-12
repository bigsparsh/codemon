"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaFile, FaFolder, FaJs } from "react-icons/fa";
import { Socket } from "socket.io-client";

const ExpandedFileMenu = ({
  depth,
  content,
  id,
  socket,
  keyname,
  setEditorLang,
  setCurrentFile,
}: {
  depth: number;
  content: { files: string[]; folders: string[] };
  id: string;
  socket: Socket;
  keyname: string;
  setEditorLang: Dispatch<SetStateAction<string>>;
  setCurrentFile: Dispatch<SetStateAction<string>>;
}) => {
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
    socket.on(
      "expand",
      (key: string, data: { files: string[]; folders: string[] }) => {
        if (key.split("/").length > 2 + depth) return;
        setExpanded((prev) => {
          const newExpanded = new Map(prev);
          newExpanded.set(key, data);
          return newExpanded;
        });
      },
    );
  }, [depth, socket]);

  return (
    <div
      style={{
        paddingLeft: `${depth * 10}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {content.folders &&
        content.folders.map((file) => (
          <div
            className="flex flex-col gap-1 cursor-pointer"
            key={file}
            onClick={(e) => {
              e.stopPropagation();
              if (expanded?.get(keyname + file)) {
                expanded.delete(keyname + file);
                setExpanded(new Map(expanded));
                return;
              }
              socket.emit("expand files", id, keyname + file);
            }}
          >
            <div className="flex gap-2 cursor-pointer hover:bg-grian-800 p-1 rounded-md items-center">
              <FaFolder />
              {file}
            </div>
            {expanded?.get(keyname + file) && (
              <ExpandedFileMenu
                keyname={keyname + file}
                depth={depth + 1}
                content={expanded.get(keyname + file)!}
                id={id}
                socket={socket}
                setEditorLang={setEditorLang}
                setCurrentFile={setCurrentFile}
              />
            )}
          </div>
        ))}
      {content.files &&
        content.files.map((file) => (
          <div
            className="flex gap-2 line-clamp-1 cursor-pointer hover:bg-grian-800 p-1 rounded-md items-center"
            key={file}
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
              socket.emit("open file", id, keyname + file);
              setCurrentFile(keyname + file);
            }}
          >
            {file.split(".").pop() === "js" ? <FaJs /> : <FaFile />}
            {file}
          </div>
        ))}
    </div>
  );
};
export default ExpandedFileMenu;
