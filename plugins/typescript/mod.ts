import * as path from "https://deno.land/std@0.100.0/path/mod.ts";
import ts from "https://esm.sh/typescript";
import type { Plugin } from "../../mod.ts";
import { stripTsExtension } from "./stripTsExtension.ts";

// @ts-expect-error
ts.sys = {
  useCaseSensitiveFileNames: true,
  newLine: "\n",
  getCurrentDirectory: Deno.cwd,
  getExecutingFilePath: () => "",
  readFile: Deno.readTextFileSync,
  fileExists(path) {
    try {
      const stat = Deno.lstatSync(path);
      return stat.isFile;
    } catch {
      return false;
    }
  },
  directoryExists(path) {
    try {
      const stat = Deno.lstatSync(path);
      return stat.isDirectory;
    } catch {
      return false;
    }
  },
};

function resolveModuleNames(moduleNames: string[], containingFile: string) {
  const resolvedModules: ts.ResolvedModule[] = [];

  moduleNames.forEach((moduleName) => {
    if (moduleName.endsWith(".d.ts")) {
      const result = ts.resolveModuleName(
        moduleName.slice(0, -5),
        containingFile,
        {},
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
        },
      );
      if (result.resolvedModule) {
        resolvedModules.push(result.resolvedModule);
      }
      return;
    }

    if (moduleName.endsWith(".ts")) {
      const result = ts.resolveModuleName(
        moduleName.slice(0, -3),
        containingFile,
        {},
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
        },
      );
      if (result.resolvedModule) {
        resolvedModules.push(result.resolvedModule);
      }
      return;
    }
  });

  return resolvedModules;
}

type PluginOptions = {
  compilerOptions?: ts.CompilerOptions;
};

export default function typescript(options: PluginOptions = {}): Plugin {
  const emittedFiles = new Map<string, string>();
  let program: ts.Program;

  return {
    name: "typescript",

    buildStart(rollupOptions) {
      const compilerOptions: ts.CompilerOptions = options.compilerOptions ?? {};
      compilerOptions.module = ts.ModuleKind.ESNext;

      const compilerHost = ts.createCompilerHost(compilerOptions);
      compilerHost.writeFile = (fileName, data) => {
        emittedFiles.set(fileName, data);
      };
      compilerHost.resolveModuleNames = resolveModuleNames;
      compilerHost.getCanonicalFileName = path.resolve;

      program = ts.createProgram(
        Object.values(rollupOptions.input).map((p) => path.resolve(p)),
        compilerOptions,
        compilerHost,
      );
    },

    transform(_, id) {
      const sourceFile = program.getSourceFile(id);
      if (!sourceFile) {
        return null;
      }

      return new Promise((resolve) => {
        if (program.getCompilerOptions().declaration) {
          program.emit(
            sourceFile,
            (fileName, data) => {
              this.emitFile({
                type: "asset",
                fileName: path.basename(fileName),
                source: data,
              });
            },
            undefined,
            true,
            stripTsExtension,
          );
        }

        program.emit(sourceFile, (_, data) => resolve(data));
      });
    },
  };
}
