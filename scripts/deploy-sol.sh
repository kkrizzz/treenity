#!/usr/bin/env bash

set -e

yarn sol:build
yarn server:build

cp -R public/* dist/solarea-prod/

SSH_STR=$F1
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

if [ -n "$SSH_PRIVATE" ]; then
  SSH_OPTS+=" -i $SSH_PRIVATE"
fi

SSH="ssh $SSH_OPTS"
SCP="scp $SSH_OPTS"

run_rsync() {
  rsync -avzh \
  --no-perms --no-owner --no-group \
  -e "$SSH" \
  --progress "$@"
}

run_rsync --delete dist/solarea-prod/ $SSH_STR:/var/www/sol.treenity.pro/
run_rsync dist/server-prod/ config package.json $SSH_STR:~/solarea/

$SSH $SSH_STR ". .nvm/nvm.sh  && pm2 restart solarea"
