rm -Rf dist/*

cd packages/server
npm run build
cd ../../

cd packages/client
npm run build
