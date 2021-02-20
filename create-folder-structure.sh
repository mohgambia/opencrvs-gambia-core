LOG_LOCATION=/var/log/opencrvs


echo "Create log folder"
sudo mkdir -p $LOG_LOCATION
sudo chown -R $USER:$USER $LOG_LOCATION

echo "create log for rotate"
touch $LOG_LOCATION/rotate-logs.log

echo "create log for deploy"
touch $LOG_LOCATION/setup-deploy-config.log

echo "create acme.json"
mkdir -p data/traefik/
touch data/traefik/acme.json
sudo chmod 600 data/traefik/acme.json


echo "create influxdb backup directory"
mkdir -p data/backups/influxdb

echo "create influxdb deirectory"
mkdir -p data/influxdb

echo "create mongo directory"
mkdir -p data/mongo
mkdir -p data/mongo1
mkdir -p data/mongo2
mkdir -p data/mongo3


echo "create elasticsearch directory"
mkdir -p data/elasticsearch
mkdir -p data/backups/elasticsearch

echo "Set higher max map count for elastic search"
sudo sysctl -w vm.max_map_count=262144



