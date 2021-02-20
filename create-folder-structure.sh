LOG_LOCATION=/var/log/opencrvs


echo "Create log folder"
sudo mkdir -p $LOG_LOCATION
sudo chown -R $USER:$USER $LOG_LOCATION

echo "create log for rotate"
touch $LOG_LOCATION/rotate-logs.log
touch $LOG_LOCATION/setup-deploy-config.log


