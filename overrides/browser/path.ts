const relativePath = /^\.?\.\//;

export function isRelative(path: string): boolean {
  return relativePath.test(path);
}

export {
  basename,
  dirname,
  extname,
  isAbsolute,
  normalize,
  relative,
  resolve,
} from "https://deno.land/std@0.100.0/path/mod.ts";
