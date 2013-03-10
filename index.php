<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <script type='text/javascript' src='jquery.min.js'></script>
        <script type="text/javascript" src="jsapi.js"></script>
        <script type="text/javascript" src="corechart.js"></script>
        <script type="text/javascript">
            google.load('visualization', '1', {packages: ['corechart', 'table']});
        </script>
        <script type="text/javascript" src="main.js?cache=<?=time()?>"></script>
        <link rel="stylesheet" type="text/css" href="main.css" />
        <title>CPU - AndroidTools</title>
    </head>
    <body style="font-family: Arial;border: 0 none;">
    	<div id="wrapper">
	        <div id="controls">
                <button id="btnUpdateDevices">Update device list</button>
                <div id="devices"></div>
                <div id="processes-container">
                    <span class="process-filter-label">Process filter:</span> <input type="text" id="process-filter" />
                    <br/>
                    <div id="processes"></div>
                </div>
	        </div>
	        <div id="visualization"></div>
	        <br class="clearboth" />
	        <br class="clearboth" />
	        <div id="datas"></div>
        </div>
        
        <div id="datatransfers"></div>
    </body>
</html>
​