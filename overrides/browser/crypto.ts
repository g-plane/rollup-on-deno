import { createHash as create } from "https://deno.land/std@0.100.0/hash/mod.ts";

export function createHash() {
  return create("sha256");
}
