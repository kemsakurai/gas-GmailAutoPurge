#!/bin/sh
cd ./frontend
ng build --prod
cd ../backend
npm run deploy
