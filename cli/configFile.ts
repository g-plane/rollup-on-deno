import { exists } from "https://deno.land/std@0.100.0/fs/exists.ts";
import * as path from "https://deno.land/std@0.100.0/path/mod.ts";
import type { RollupOptions } from "../mod.ts";

async function getConfigFilePath(cliArg: string | undefined): Promise<string> {
  if (cliArg) {
    return path.resolve(cliArg);
  } else {
    const defaultConfig = await detectDefaultConfig();
    if (defaultConfig) {
      return defaultConfig;
    } else {
      throw new Error("No configuration file.");
    }
  }
}

async function detectDefaultConfig(): Promise<string | false> {
  const extensions = ["ts", "mjs", "js"];
  for (const extension of extensions) {
    const filePath = path.resolve(`rollup.config.${extension}`);
    if (await exists(filePath)) {
      return filePath;
    }
  }

  return false;
}

export async function loadConfig(
  cliArg: string | undefined,
): Promise<RollupOptions> {
  const filePath = await getConfigFilePath(cliArg);
  const { default: config } = await import(filePath);

  return config;
}
