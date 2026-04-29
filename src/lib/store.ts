import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

function fileFor(entity: string) {
  return path.join(DATA_DIR, `${entity}.json`);
}

export async function readEntity<T = any>(entity: string, fallback: T): Promise<T> {
  await ensureDir();
  const file = fileFor(entity);
  try {
    const buf = await fs.readFile(file, "utf8");
    return JSON.parse(buf) as T;
  } catch {
    await writeEntity(entity, fallback);
    return fallback;
  }
}

export async function writeEntity(entity: string, data: any) {
  await ensureDir();
  const file = fileFor(entity);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export function makeId(prefix = "") {
  const rnd = Math.random().toString(36).slice(2, 7);
  return `${prefix}${Date.now().toString(36)}${rnd}`;
}
