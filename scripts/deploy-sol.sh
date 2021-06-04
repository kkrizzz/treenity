#!/usr/bin/env bash

set -e

yarn sol:build
yarn server:build

cp -R public/* dist/solarea-prod/

SSH_STR=$F1
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $SSH_PRIVATE"
SSH="ssh $SSH_OPTS"
SCP="scp $SSH_OPTS"

run_rsync() {
  rsync -avzh \
  --no-perms --no-owner --no-group \
  -e "$SSH" \
  --progress "$@"
}

run_rsync --delete dist/solarea-prod/ $F1:/var/www/sol.treenity.pro/
run_rsync dist/server-prod/ config package.json $F1:~/solarea/

$SSH $F1 ". .nvm/nvm.sh  && pm2 restart solarea"
