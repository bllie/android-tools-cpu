Make sure, you have the ANDROID_HOME environment variable set up to point to SDK's home like "/opt/android/android-sdk-linux_x86".
To start seeing cpu usage, use "./cpu-tool.sh", it requires Google Chrome to be on the path.


If you need more control, in the directory of the source files, start php as a local server:

$ php -S localhost:8083

and navigate to http://localhost:8083/


Todo:

- true multi device support (start, stop)
- don't let adb running forever (use -n x switch and restart it)
- tweak description to include keywords like android, cpu, usage, stat, graph, process, ...
- optimize the code


For debugging: 

while (true); do; clear; ps aux | grep -i "%CPU\|php\|adb" | grep -v grep; sleep 1; done;
curl "http://localhost:8089/ajax.php?device=SH0BVRX02061&op=data"
tail -f error_log