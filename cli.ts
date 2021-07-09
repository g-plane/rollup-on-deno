import * as fs from "https://deno.land/std@0.100.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.100.0/path/mod.ts";
import yargs from "https://deno.land/x/yargs@v17.0.1-deno/deno.ts";
import {
  OutputOptions,
  rollup,
  RollupOptions,
  VERSION as rollupVersion,
} from "./mod.ts";

const argv = yargs(Deno.args)
  .version(rollupVersion)
  .alias("v", "version")
  .help("help")
  .alias("h", "help")
  .option("config", {
    alias: "c",
    describe: "Use specific config file",
    type: "string",
  })
  .strict()
  // @ts-ignore
  .argv;

console.log(argv);

async function detectDefaultConfig(): Promise<string | false> {
  const tsFormat = path.resolve("rollup.config.ts");
  if (await fs.exists(tsFormat)) {
    return tsFormat;
  }

  const jsFormat = path.resolve("rollup.config.js");
  if (await fs.exists(jsFormat)) {
    return jsFormat;
  }

  return false;
}
