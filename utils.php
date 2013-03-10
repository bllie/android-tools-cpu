<?php

	error_reporting(E_ALL);
	ini_set('error_reporting', E_ALL);
	ini_set('display_errors', 'stdout');
	ini_set('log_errors', true);
	ini_set('track_errors', true);
	ini_set('error_log', "./error_log");

	$android_home=getenv('ANDROID_HOME');
	$adb=$android_home."/platform-tools/adb";
	
	$process_count = 100;