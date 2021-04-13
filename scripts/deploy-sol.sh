#!/usr/bin/env bash

set -e

rm -rf dist/solana-prod dist/server-prod
yarn sol:build
yarn server:build

cp -R public/* dist/solana-prod/

rsync -azvh --delete dist/solana-prod  $F1:/var/www/sol.treenity.pro/
rsync -azvh dist/server-prod/ config package.json $F1:/solarea/

ssh $F1 ". .nvm/nvm.sh  && pm2 restart solarea"
