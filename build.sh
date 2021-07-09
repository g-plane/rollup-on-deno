#!/bin/bash
set -e

cp ./overrides/rollup.config.ts ./rollup/rollup.deno.config.ts
cp -r ./overrides/browser ./rollup/
cd rollup
COMMITHASH=$(git rev-parse HEAD) npx rollup --config ./rollup.deno.config.ts --configPlugin typescript
cp ./src/rollup/types.d.ts ../dist/rollup.d.ts
git restore '*'
rm rollup.deno.config.ts
