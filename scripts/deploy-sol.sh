#!/usr/bin/env bash

set -e

yarn sol:build
yarn server:build

cp -R public/* dist/solarea-prod/

SSH_STR=$F1
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $SSH_PRIVATE"
SSH="ssh $SSH_OPTS"
SCP="scp $SSH_OPTS"

RSYNC="rsync -avzh \
  --no-perms --no-owner --no-group \
  -e "$SSH" --rsync-path="sudo rsync" \
  --delete --progress "


$RSYNC --delete dist/solarea-prod/  $F1:/var/www/sol.treenity.pro/
$RSYNC dist/server-prod/ config package.json $F1:~/solarea/

$SSH $F1 ". .nvm/nvm.sh  && pm2 restart solarea"
