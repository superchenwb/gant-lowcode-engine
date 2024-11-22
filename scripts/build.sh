#!/usr/bin/env bash

set -e

lerna run build \
  --scope @gant-lowcode/lowcode-types \
  --scope @gant-lowcode/lowcode-utils \
  --scope @gant-lowcode/lowcode-shell \
  --scope @gant-lowcode/lowcode-editor-core \
  --scope @gant-lowcode/lowcode-editor-skeleton \
  --scope @gant-lowcode/lowcode-designer \
  --scope @gant-lowcode/lowcode-plugin-designer \
  --scope @gant-lowcode/lowcode-plugin-command \
  --scope @gant-lowcode/lowcode-plugin-outline-pane \
  --scope @gant-lowcode/lowcode-react-renderer \
  --scope @gant-lowcode/lowcode-react-simulator-renderer \
  --scope @gant-lowcode/lowcode-renderer-core \
  --scope @gant-lowcode/lowcode-workspace \
  --scope @gant-lowcode/lowcode-engine \
  --stream

lerna run build:umd \
  --scope @gant-lowcode/lowcode-engine \
  --scope @gant-lowcode/lowcode-react-simulator-renderer \
  --scope @gant-lowcode/lowcode-react-renderer \
  --stream

cp ./packages/react-simulator-renderer/dist/js/* ./packages/engine/dist/js/
cp ./packages/react-simulator-renderer/dist/css/* ./packages/engine/dist/css/
