#!/bin/bash

host=localhost
port=8090
dir=`dirname $0`

echo -n "Starting local server: "
php -t $dir -S $host:$port &>/tmp/cpu-tool.tmp &
pid=$!
sleep 1
ps aux | grep $pid | grep -v grep >/dev/null
if [[ $? -eq 0 ]]; then
	echo "OK."
	echo "Running Google Chrome ( http://$host:$port/ )..."
	echo "Exit the browser to finish and to stop the local server OR press Ctrl+C now."
	google-chrome http://$host:$port/ --app=cpu-tool --user-data-dir=/tmp/cpu-tool &>/dev/null
	echo -n "Stopping local server: "
	kill $pid &>/dev/null
	if [[ $? -eq 0 ]]; then
		echo "OK."
	else
		echo "Error!"
		exit 1
	fi;
else
	echo "Error!"
	cat /tmp/cpu-tool.tmp
	exit 1
fi