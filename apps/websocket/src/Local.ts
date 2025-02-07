import { getFileContent, listObjectsWithRawPath } from "./Storage";
import fs from "fs";

export const createLocalFolder = async (folder: string, lord_id: string) => {
  const items = await listObjectsWithRawPath(folder);
  console.log(items);

  try {
    fs.mkdirSync("/tmp/project");
  } catch (e) {
    console.log("Project folder already exists");
  }

  try {
    fs.mkdirSync("/tmp/project/" + lord_id);
  } catch (e) {
    console.log("User folder already exists");
  }

  items.folders?.forEach(async (f) => {
    if (!f) return;
    const split = f.split("/");
    fs.mkdirSync(`/tmp/project/${lord_id}/${f}`);
    await createLocalFolder(`${folder}${split[split.length - 2]}/`, lord_id);
  });
  items.files?.forEach(async (f) => {
    fs.writeFileSync(`/tmp/project/${lord_id}/${f}`, "");
    await getFileContent(`demo-r2/nodejs/${f}`, lord_id);
  });
};

export const writeLocalFile = async (file: string, content: string) => {
  try {
    fs.writeFileSync(file, content);
  } catch (e) { }
};

export const openLocalFile = async (file: string, lord_id: string) => {
  const content = fs.readFileSync(`/tmp/project/${lord_id}/${file}`);
  return content.toString();
};
