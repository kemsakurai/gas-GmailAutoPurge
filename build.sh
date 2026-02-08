#!/bin/bash
rm -Rf dist/*

cd packages/server
npm run build
cd ../../