import { rollup } from "../mod.ts";
import type { RollupOptions } from "../mod.ts";

export async function build(options: RollupOptions) {
  if (!options.output) {
    throw new Error("Output options are required.");
  }

  const bundle = await rollup(options);
  if (Array.isArray(options.output)) {
    await Promise.all(options.output.map(bundle.write));
  } else {
    await bundle.write(options.output);
  }
}
