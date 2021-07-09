import { ensureDir } from "https://deno.land/std@0.100.0/fs/ensure_dir.ts";
import { dirname } from "https://deno.land/std@0.100.0/path/mod.ts";

export function readFile(path: string) {
  return Deno.readTextFile(path);
}

export async function writeFile(path: string, data: Uint8Array | string) {
  await ensureDir(dirname(path));

  if (typeof data === "string") {
    await Deno.writeTextFile(path, data);
  } else {
    await Deno.writeFile(path, data);
  }
}
