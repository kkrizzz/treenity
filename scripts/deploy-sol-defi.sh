#!/usr/bin/env bash

set -e

yarn clean:prod
yarn sol:build
yarn server:build

DOMAIN=defi.parts
SSH_STR=root@$DOMAIN
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

run_rsync --delete dist/solarea-prod/ $SSH_STR:/var/www/$DOMAIN/
run_rsync dist/server-prod/ config solarea package.json $SSH_STR:~/$DOMAIN/
#run_rsync config/solarea/ $SSH_STR:~/$DOMAIN/config/

$SSH $SSH_STR ". .nvm/nvm.sh  && pm2 restart solarea"
