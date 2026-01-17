// DB/index.ts
import fs from "node:fs/promises";
import path from "node:path";

const DB_DIR = path.resolve(process.cwd(), "DB");
const DATA_PATH = path.join(DB_DIR, "data.json");
const INITIAL_PATH = path.join(DB_DIR, "initialData.json");

const ENCODING : BufferEncoding = "utf-8";
export async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const initial = await fs.readFile(INITIAL_PATH, ENCODING);
    await fs.writeFile(DATA_PATH, initial, ENCODING);
  }
}

export async function readData<T = unknown>(): Promise<T> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, ENCODING);
  return JSON.parse(raw) as T;
}

export async function writeData<T = unknown>(data: T) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), ENCODING);
}

export async function resetDataFromInitial() {
  const initial = await fs.readFile(INITIAL_PATH, ENCODING);
  await fs.writeFile(DATA_PATH, initial, ENCODING);
}
