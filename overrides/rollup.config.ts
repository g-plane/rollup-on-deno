import path from "path";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import replaceBrowserModules from "./build-plugins/replace-browser-modules";
import pkg from "./package.json";

const now = new Date().toUTCString();

const banner = `/*
  @license
	Rollup.js v${pkg.version}
	${now} - commit ${process.env.COMMITHASH}

	https://github.com/rollup/rollup

	Released under the MIT License.
*/`;

const moduleAliases = {
  entries: [
    { find: "help.md", replacement: path.resolve("cli/help.md") },
    { find: "package.json", replacement: path.resolve("package.json") },
    {
      find: "acorn",
      replacement: path.resolve("node_modules/acorn/dist/acorn.mjs"),
    },
  ],
  resolve: [".js", ".json", ".md"],
};

export default {
  input: "src/browser-entry.ts",
  output: { banner, file: "../dist/rollup.js", format: "es" },
  plugins: [
    replaceBrowserModules(),
    alias(moduleAliases),
    resolve({ browser: true }),
    json(),
    commonjs(),
    typescript(),
  ],
  external: (id) => id.startsWith("https://"),
  strictDeprecations: true,
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};
