#!/usr/bin/env bash

rm -rf node_modules package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap

lerna exec --stream \
  --scope @gant-lowcode/lowcode-editor-core \
  --scope @gant-lowcode/lowcode-types \
  --scope @gant-lowcode/lowcode-utils \
  -- npm run build
