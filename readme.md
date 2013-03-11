Requirements:

- Linux (other platforms maybe supported later)
- ANDROID_HOME environment variable set up to point to SDK's home like "/opt/android/android-sdk-linux_x86".
- PHP 5.4
- Git for install or download as a ZIP: https://github.com/parhuzamos/android-tools-cpu/archive/master.zip
- Google Chrome (any browser should do, but )


Install (example):

mkdir ~/bin &>/dev/null
cd ~/bin
git clone git://github.com/parhuzamos/android-tools-cpu.git


Launch:

If you have Google Chrome:
(It's automatically launched and when closed the program finishes.)

cd ~/bin/android-tools-cpu
./cpu-tool.sh


If you use some other browser:
(No browser is opened and you have to manually exit the program.)

cd ~/bin/android-tools-cpu
./no-browser.sh

and navigate to http://localhost:8083/ 


Todo:

- true multi device support (start, stop)
- don't let adb run forever (use -n x switch and restart it periodically)
- tweak description to include keywords like android, cpu, usage, stat, graph, process, ...
- optimize the code
- handle disconnected device, don't try to wait for it
- check for PHP 5.4
- PHP error logging to file
- loading indicator for "Update device list"
- message if no device present
- handle adb execution errors
- support other browsers 
- start without browser
- check ANDROID_HOME and show error on the UI
- heartbeat ui for examined devices
- allow devices to be named (simple question box and write a file on the sdcard)


For debugging: 

while (true); do; clear; ps aux | grep -i "%CPU\|php\|adb" | grep -v grep; sleep 1; done;
curl "http://localhost:8089/ajax.php?device=SH0BVRX02061&op=data"
tail -f error_log