import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import { writeLocalFile } from "./Local";

dotenv.config();

export enum ProjectType {
  NODE,
  PYTHON,
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_NAME as string}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

export const listObjectsWithRawPath = async (path: string) => {
  console.log("Path: ", path);
  const stuff = await s3.send(
    new ListObjectsV2Command({
      Bucket: "code-lord",
      Prefix: path,
      Delimiter: "/",
    }),
  );
  const files = stuff.Contents?.map((file) =>
    file.Key?.replace("demo-r2/nodejs/", ""),
  );
  const callFile = stuff.Contents?.map((file) => file.Key);
  const folders = stuff.CommonPrefixes?.map((fl) =>
    fl.Prefix?.replace("demo-r2/nodejs/", ""),
  );
  const callFolder = stuff.CommonPrefixes?.map((fl) => fl.Prefix);
  return { files, folders, callFile, callFolder };
};

export const listObjectsInFolder = async (
  folder: string,
  emit: boolean = true,
  socket?: Socket,
) => {
  const stuff = await s3.send(
    new ListObjectsV2Command({
      Bucket: "code-lord",
      Prefix: `project/${folder}/`,
      Delimiter: "/",
    }),
  );
  const files = stuff.Contents?.map((file) =>
    file.Key?.replace(`project/${folder}/`, ""),
  );
  const folders = stuff.CommonPrefixes?.map((fl) =>
    fl.Prefix?.replace(`project/${folder}/`, ""),
  );
  if ((files || folders) && emit) {
    socket?.emit("files", {
      files,
      folders,
    });
  }
  if (!emit) {
    return {
      files,
      folders,
    };
  }
};

export const giveTemplate = async (type: ProjectType) => {
  const project = type === ProjectType.NODE ? "nodejs" : "python";
  const objects = await s3.send(
    new ListObjectsV2Command({
      Bucket: "code-lord",
      Prefix: `demo-r2/${project}/`,
      Delimiter: "/",
    }),
  );
  return {
    files: objects.Contents?.map((file) =>
      file.Key?.replace(`demo-r2/${project}/`, ""),
    ),
    folders: objects.CommonPrefixes?.map((fl) =>
      fl.Prefix?.replace(`demo-r2/${project}/`, ""),
    ),
  };
};

export const expandFolder = async (fname: string, lord_id: string) => {
  const stuff = await s3.send(
    new ListObjectsV2Command({
      Bucket: "code-lord",
      Prefix: `project/${lord_id}/${fname}`,
      Delimiter: "/",
    }),
  );
  const files = stuff.Contents?.map((file) =>
    file.Key?.replace(`project/${lord_id}/${fname}`, ""),
  );
  const folders = stuff.CommonPrefixes?.map((fl) =>
    fl.Prefix?.replace(`project/${lord_id}/${fname}`, ""),
  );
  return { files, folders };
};

export const deleteEverything = async () => {
  const objects = await s3.send(
    new ListObjectsV2Command({
      Bucket: "code-lord",
      Prefix: "project/",
    }),
  );
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: "code-lord",
      Delete: {
        Objects: objects.Contents?.map((obj) => ({ Key: obj.Key })),
        Quiet: true,
      },
    }),
  );
};

export const createFolder = async (folder: string, type: ProjectType) => {
  const objects = await s3.send(
    new ListObjectsV2Command({
      Bucket: "code-lord",
      Prefix: type === ProjectType.NODE ? "demo-r2/nodejs" : "demo-r2/python",
    }),
  );
  await Promise.all([
    objects.Contents?.map(async (obj) => {
      const newKey = obj.Key?.replace(
        type === ProjectType.NODE ? "demo-r2/nodejs" : "demo-r2/python",
        `project/${folder}`,
      );
      await s3.send(
        new CopyObjectCommand({
          Bucket: "code-lord",
          CopySource: `code-lord/${obj.Key}`,
          Key: newKey,
        }),
      );
    }),
  ]);
  return objects;
};

export const getFileContent = async (folder_name: string, lord_id: string) => {
  const file = await s3.send(
    new GetObjectCommand({
      Bucket: "code-lord",
      Key: folder_name,
    }),
  );
  const localPath = folder_name.replace(
    "demo-r2/nodejs/",
    `/tmp/project/${lord_id}/`,
  );
  await writeLocalFile(
    localPath,
    (await file.Body?.transformToString()) as string,
  );
  // await writeLocalFile(localPath, );
};
