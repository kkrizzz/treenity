#!/usr/bin/env bash

set -e

yarn sol:build
yarn server:build

rsync -azvh --delete dist/solana-prod dist/server-prod.js config package.json $F1:/var/www/sol.treenity.pro/

ssh $F1 ". .nvm/nvm.sh  && pm2 restart treenity-exp"
