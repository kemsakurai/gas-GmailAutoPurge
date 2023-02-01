rm -Rf dist/*

cd packages/server
npm run build
cd ../../

cp README.md ./packages/client/src/About.md
cd packages/client
npm run lint
npm run build
