import yargs from "https://deno.land/x/yargs@v17.0.1-deno/deno.ts";
import type { Arguments } from "https://deno.land/x/yargs@v17.0.1-deno/deno-types.ts";
import { VERSION as rollupVersion } from "./mod.ts";
import { build } from "./cli/build.ts";
import { loadConfig } from "./cli/configFile.ts";

const argv: Arguments = yargs(Deno.args)
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

const config = await loadConfig(argv.config);
await build(config);
