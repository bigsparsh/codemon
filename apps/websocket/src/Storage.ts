import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Socket } from "socket.io";

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

export const listObjectsInFolder = async (folder: string, socket: Socket) => {
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
  console.log(stuff);
  if (files || folders) {
    socket.emit("files", {
      files,
      folders,
    });
  }
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
