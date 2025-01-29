"use client";
import { useEffect, useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import { Socket } from "socket.io-client";

const FileMenu = ({ id, socket }: { id: string; socket: Socket }) => {
  const [folderStructure, setFolderStructure] = useState<{
    files: string[];
    folders: string[];
  }>();
  useEffect(() => {
    // socket.emit("get files", id);
    socket.on("files", (data: { files: string[]; folders: string[] }) => {
      setFolderStructure(data);
    });
  }, [id, socket]);

  return (
    <div className="p-2">
      {folderStructure?.folders.map((file) => (
        <div className="flex gap-3" key={crypto.randomUUID()}>
          <FaFolder />
          {file}
        </div>
      ))}
      {folderStructure?.files.map((file) => (
        <div className="flex gap-3" key={crypto.randomUUID()}>
          <FaFile />
          {file}
        </div>
      ))}
    </div>
  );
};

export default FileMenu;
