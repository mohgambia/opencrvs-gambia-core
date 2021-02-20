LOG_LOCATION=/var/log/opencrvs


echo "Create log folder"
sudo mkdir -p $LOG_LOCATION
sudo chown -R $USER:$USER $LOG_LOCATION