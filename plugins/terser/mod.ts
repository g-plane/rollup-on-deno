import {
  minify,
  MinifyOptions,
  MinifyOutput,
  SourceMapOptions,
} from "https://esm.sh/terser";
import type { Plugin } from "../../mod.ts";

export default function terser(options: MinifyOptions): Plugin {
  return {
    name: "terser",

    renderChunk(code, chunk, outputOptions) {
      const sourceMapOptions: SourceMapOptions = {
        content: chunk.map,
      };

      return minify(code, {
        ...options,
        sourceMap: outputOptions.sourcemap && sourceMapOptions,
      }) as Promise<MinifyOutput & { code: string }>;
    },
  };
}
