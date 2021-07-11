// @deno-types=https://cdn.jsdelivr.net/npm/esbuild-wasm@0.12.15/esm/browser.d.ts
import {
  initialize,
  transform,
} from "https://cdn.jsdelivr.net/npm/esbuild-wasm@0.12.15/esm/browser.js";
import type { Plugin } from "../../mod.ts";

export default function esbuild(): Plugin {
  return {
    name: "esbuild",

    buildStart() {
      return initialize({
        worker: false,
        wasmURL:
          "https://cdn.jsdelivr.net/npm/esbuild-wasm@0.12.15/esbuild.wasm",
      });
    },

    transform(code, id) {
      if (/\.[tj]sx?$/.test(id)) {
        return transform(code, {
          sourcemap: true,
          loader: "tsx",
        });
      } else {
        return null;
      }
    },
  };
}
