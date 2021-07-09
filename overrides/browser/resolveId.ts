import {
  dirname,
  isAbsolute,
  resolve,
} from "https://deno.land/std@0.100.0/path/mod.ts";
import {
  CustomPluginOptions,
  Plugin,
  ResolvedId,
  ResolveIdResult,
} from "../src/rollup/types";
import { PluginDriver } from "../src/utils/PluginDriver";
import { resolveIdViaPlugins } from "../src/utils/resolveIdViaPlugins";

export async function resolveId(
  source: string,
  importer: string | undefined,
  _preserveSymlinks: boolean,
  pluginDriver: PluginDriver,
  moduleLoaderResolveId: (
    source: string,
    importer: string | undefined,
    customOptions: CustomPluginOptions | undefined,
    skip:
      | { importer: string | undefined; plugin: Plugin; source: string }[]
      | null,
  ) => Promise<ResolvedId | null>,
  skip:
    | { importer: string | undefined; plugin: Plugin; source: string }[]
    | null,
  customOptions: CustomPluginOptions | undefined,
): Promise<ResolveIdResult> {
  const pluginResult = await resolveIdViaPlugins(
    source,
    importer,
    pluginDriver,
    moduleLoaderResolveId,
    skip,
    customOptions,
  );
  if (pluginResult != null) return pluginResult;

  // external modules (non-entry modules that start with neither '.' or '/')
  // are skipped at this stage.
  if (importer !== undefined && !isAbsolute(source) && source[0] !== ".") {
    return null;
  }

  // `resolve` processes paths from right to left, prepending them until an
  // absolute path is created. Absolute importees therefore shortcircuit the
  // resolve call and require no special handing on our part.
  return importer ? resolve(dirname(importer), source) : resolve(source);
}
