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

echo "Creating secrets - `date --iso-8601=ns`"

PRIV_KEY=$(openssl genrsa 2048 2>/dev/null)
PUB_KEY=$(echo "$PRIV_KEY" | openssl rsa -pubout 2>/dev/null)

docker secret rm jwt-public-key || true
docker secret rm jwt-private-key || true


echo "$PUB_KEY" | docker secret create jwt-public-key -
echo "$PRIV_KEY" | docker secret create jwt-private-key -

# sed -i "s/{{ts}}/$UNIX_TS/g" "$@"
echo "DONE - CREATED KEYS ON `date --iso-8601=ns`"

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
HOSTNAME='draman.iprocuratio.com' VERSION='latest' PAPERTRAIL='$PAPERTRAIL' docker stack deploy -c stack-infraestructure.yml --with-registry-auth infrastructure

echo "Deploy the OpenCRVS databases onto the swarm"
HOSTNAME='draman.iprocuratio.com' VERSION='latest' PAPERTRAIL='$PAPERTRAIL' docker stack deploy -c stack-databases.yml --with-registry-auth databases

echo "Deploy the OpenCRVS fhir components onto the swarm"
HOSTNAME='draman.iprocuratio.com' VERSION='latest' PAPERTRAIL='$PAPERTRAIL' docker stack deploy -c stack-fhir.yml --with-registry-auth fhir
