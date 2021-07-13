import { createHash as create } from "https://deno.land/std@0.100.0/hash/mod.ts";
import type { Hasher } from "https://deno.land/std@0.100.0/hash/mod.ts";

export function createHash() {
  const hasher = create("sha256");

  const update: Hasher["update"] = (data) => hasher.update(data);
  const digest = (format?: Parameters<Hasher["toString"]>[0]): string =>
    hasher.toString(format);

  return { update, digest };
}
