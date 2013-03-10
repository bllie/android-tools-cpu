<?php

	include_once('utils.php');
	
	set_time_limit(0);

	//TODO: parse the header line and use those columns to find the correct cpu column, as some adb shell top produces 10 columns not 9
	function processOutput($device,$out) {
		$out = trim($out);
		$out = preg_split("/\n/", $out);

		$result = array(
			"device"=>$device,
			"time"=>date("H:i:s")
		);

		if (trim($out[0]) != "") {
			//extract the first line with system info
			$sys = $out[0];
			$sys = preg_split("/,/", $sys);
			foreach ($sys as $value) {
				$value = preg_split("/ /", trim($value));
				$result[$device."-".$value[0]] = str_replace("%", "", $value[1]);
			}

			// remove the first few lines
			$out = array_slice($out, 4);

			// trim and extract process lines
			foreach ($out as $value) {
				if (trim($value) == "") {
					continue;
				}
				$value = preg_split("/ /", trim($value));
				$l = array();
				foreach ($value as $k => $v) {
					if (trim($v) != "") {
						$l[] = $v;
					}
				}
				if (isset($l[8])) {
					$result[$device."-".str_replace(array('/','.',' ',':'),'_',$l[8])] = str_replace("%", "", $l[1]);
				}

				//echo($value[2]." = ".$value[]);
				//var_dump($l);
			}
		} else {
			if (count($result) == 0) {
				$result[$device."-"."no data"] = 0;
			}
		}

		return $result;		
	}
	

	function getDevices() {
		global $adb;

		$out=trim(shell_exec($adb." devices"));
		if (strlen($out) > 0) {
			$out="egy\nketto\nharom\n".$out;

			$out=preg_split("/\n/", $out);
			$db=0;
			while(count($out) > 0 && strpos($out[0], "List of") === false) {
				array_shift($out);

				$db++;
				if ($db > 10) {
					break;
				}
			}
			unset($out[0]);

			foreach($out as $key => $value) {
				$a=preg_split("/	/",$value);
				$out[$key]=$a[0];
			}

			$out2=array();
			foreach($out as $key => $value) {
				$fn="/sdcard/deviced.name";
				$s=shell_exec($adb."  -s ".$value." shell cat ".$fn);
				if (strpos($s,$fn) === false) {
					$out2[$value] = trim($s);
				} else {
					$out2[$value] = "";
				}
			}

			return $out2;
		} else {
			return array();
		}
	}

	function adbCheck() {
		$cmdline = "shell top -d 1";
		exec("ps aux | grep '$cmdline' | grep -v grep | awk '{ print $2 }' | head -1", $out);
		return count($out)>0 ? $out[0] : false;
	}


	function adbReadData($device) {
		global $process_count;

		@unlink("stop");
		$pid = adbCheck();
		if ($pid !== false) {
			$block = "";
			$cnt = 0;
			$firstbreak = false;
			$waited = 0;
			$f = fopen("/proc/$pid/fd/1", 'r');
			while(true) {
				$l = stream_get_line($f, 1024, PHP_EOL);
				if (($l !== false) && ($firstbreak == false)) {
					continue;
				}
				if (trim($l)) {
					// echo("read: ".$l.PHP_EOL);
					$block.= $l.PHP_EOL;
					$cnt++;
					$waited = 0;
				}
				if ($cnt == $process_count+3) {
					$data = processOutput($device, $block);
					$json = array("device" => $device, "op" => "data", "data" => $data, "message" => null, "pid" => $pid);
					echo(json_encode($json));

					$block = "";
					$cnt = 0;

					break;
				}
				if ($l === false) {
					sleep(1);
					$waited++;
					$cnt = 0;
					$block = "";
					$firstbreak = true;

					if (file_exists("stop")) {
						$json = array("device" => $device, "op" => "ack", "data" => "stop", "message" => "Stop accepted.");
						echo(json_encode($json));
						return;
					}

					if ($waited > 5) {
						$json = array("device" => $device, "op" => "no_data", "data" => null, "message" => "No data for 5 seconds, stopping.");
						echo(json_encode($json));
						break;
					}
				}
			}
			fclose($f);
		} else {
			return false;
		}
	}


	function adbStart() {
		global $adb;
		global $process_count;

		exec("$adb shell top -d 1 -m $process_count 1>/tmp/adb.1 2>&1 &");
	}

	function adbStop() {
		$pid = adbCheck();
		if ($pid !== false) {
			exec("kill ".$pid);
			return adbCheck() === false;
		} else {
			return false;
		}
	}


	if (isset($_GET["start"]) && $_GET["start"]) {
		$pid = adbCheck();
		if ($pid === false) {
			adbStart();
		}
	} else if (isset($_GET["stop"]) && $_GET["stop"]) {
		touch("stop");

		header("Content-type: application/json");
		echo(json_encode(array("message"=>"Stop accepted for ".$_GET["device"].".","device"=>$_GET["device"])));
	} else if (isset($_GET['devices'])) {
		$devices=getDevices();

		header("Content-type: application/json");
		echo(json_encode($devices));	

	} else if (isset($_GET['op']) && $_GET['op'] = 'data') {
		$pid = adbCheck();
		if ($pid === false) {
			adbStart();
		}
		header("Content-type: application/json");
		adbReadData($_GET["device"]);
	}