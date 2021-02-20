# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.
#
# OpenCRVS is also distributed under the terms of the Civil Registration
# & Healthcare Disclaimer located at http://opencrvs.org/license.
#
# Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
# graphic logo are (registered/a) trademark(s) of Plan International.
set -e

VERSION=latest
RESOURCES_PATH=../opencrvs-gambia/
LOG_LOCATION=/var/log/opencrvs

echo "Netdata user and passwrod"
NETDATA_USER=monitor
NETDATA_PASSWORD=monitor-password
NETDATA_USER_DETAILS_BASE64=`echo $(htpasswd -nb $NETDATA_USER $NETDATA_PASSWORD) | base64`

echo $NETDATA_USER $NETDATA_PASSWORD $NETDATA_USER_DETAILS_BASE64

echo
echo "Deploying version $VERSION to localhost..."
echo

mkdir -p /tmp/compose/infrastructure/default_backups
mkdir -p /tmp/compose/infrastructure/default_updates

# echo "Copy selected country default backups to infrastructure default_backups folder"
# cp $RESOURCES_PATH/backups/hearth-dev.gz /tmp/compose/infrastructure/default_backups/hearth-dev.gz
# cp $RESOURCES_PATH/backups/openhim-dev.gz /tmp/compose/infrastructure/default_backups/openhim-dev.gz
# cp $RESOURCES_PATH/backups/user-mgnt.gz /tmp/compose/infrastructure/default_backups/user-mgnt.gz

# echo "Copy selected country default updates to infrastructure default_updates folder"
# [[ -d $RESOURCES_PATH/updates/generated ]] && cp $RESOURCES_PATH/updates/generated/*.json /tmp/compose/infrastructure/default_updates

# echo "Copy all infrastructure files to the server"
# rsync -rP docker-compose* infrastructure /tmp/compose/

# echo "Copy all country compose files to the server"
# rsync -rP $RESOURCES_PATH/docker-compose.resources* infrastructure /tmp/compose/

# echo "Override configuration files with country specific files"
# rsync -rP /tmp/compose/infrastructure /tmp/compose




echo "Prepare docker-compose.deploy.yml and docker-compose.<COUNTRY>.yml file - rotate secrets etc"
./infrastructure/rotate-secrets.sh ./composes/docker-compose.deploy.yml ./composes/docker-compose.prod-deploy.yml $RESOURCES_PATH/docker-compose.resources.deploy.yml | tee -a $LOG_LOCATION/rotate-secrets.log


echo "Setup configuration files and compose file for the deployment domain"
/tmp/compose/infrastructure/setup-deploy-config.sh localhost '$NETDATA_USER_DETAILS_BASE64' | tee -a $LOG_LOCATION/setup-deploy-config.log

echo "create fake clickatell system" 
docker secret rm clickatell-api-id || true
printf ksdjflasdkjf | docker secret create clickatell-api-id -
docker secret rm clickatell-password || true
printf ksdjflasdkjf | docker secret create clickatell-password -
docker secret rm clickatell-user || true
printf ksdjflasdkjf | docker secret create clickatell-user -


echo "Deploy the OpenCRVS infrastructure onto the swarm"
# HOSTNAME='opencrvs.local' VERSION='latest' PAPERTRAIL='$PAPERTRAIL' docker stack deploy -c docker-compose.deps.yml -c docker-compose.yml -c docker-compose.deploy.single-node.yml  -c docker-compose.prod-deploy.yml -c docker-compose.resources.deploy.yml --with-registry-auth opencrvs
HOSTNAME='opencrvs.local' VERSION='latest' PAPERTRAIL='$PAPERTRAIL' docker stack deploy -c stack-infraestructure.yml --with-registry-auth infrastructure

