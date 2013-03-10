var allcolumns = new Array();
var rows = new google.visualization.DataTable();
var linechart = null;
var colors = new Array("Red","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Red","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Red","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo");
var colorindex = 0;
var series = {};
var lastupdate = 0;
var samples = 5*60;
var avg = new Array();
var cnt = new Array();
var resetstat = 30;
var rowQueue = new Array();

var deviceList = new Array();

function displayGraph(source) {
    if (linechart == null) {
        rows.addColumn("string", "time");
        
        linechart = new google.visualization.LineChart(document.getElementById('visualization'));
        var i = 0;
        for(var c in colors) {
            series[i]={color:colors[c], visibleInLegend: false};
            i++;
        }
    }

    var device = source.device;
    delete source.device;
    var time = source.time;
    delete source.time;
    
    var v = 0;
    var k = null;
    //count avarage for all entries
    for(var a in source) {
    	k = a+"-avg";
    	v = parseInt(source[a]);
    	if (!avg[k]) {
    		avg[k] = 0;
    	}
    	if (!cnt[k]) {
    		cnt[k] = 0;
    	}
    	
        //remark this to have a "constant" and not floating average    
       	if (cnt[k] == resetstat) {
       		cnt[k] = 0;
       		avg[k] = 0;
       	}
    	
    	cnt[k]++;
        avg[k] = avg[k] + v;
        
        source[k] = avg[k] / cnt[k];
    }
    var deviceBlocks = new Array();
    var process = "";
    for(var a in source) {
        if (allcolumns.indexOf(a) == -1) {
            allcolumns.push(a);

            rows.addColumn("number", a, a);

            process = a.substr(a.indexOf('-')+1);

            var div = $("#device-"+device);
            if (div.length == 0) {
                div = deviceBlocks[device];
            }
            if (!div) {
                div = $(document.createElement("div"));
                div.attr("device", device).attr("id", "device-"+device);
                deviceBlocks[device] = div;
            }  
            
            var i = $(document.createElement("input"));
            i.attr("id","process_"+a).attr("type","checkbox");
            // if (a.indexOf("-System") > -1 || a.indexOf("-tv_ustream_ustream") > -1 || a.indexOf("-User") > -1) {
            if (a.indexOf("-tv_ustream_ustream") > -1) {
                i.attr("checked","on");
            }
            var line = $(document.createElement("div"));
            line.addClass("process-line").attr("process", process.toLowerCase());
            var d = $(document.createElement("div"));
            d.addClass("colorblock").html("").css("background-color",colors[colorindex]).attr('title',colors[colorindex]);
            var l = $(document.createElement("label"));
            l.attr("for","process_"+a);
            var s = $(document.createElement("span"));
            s.attr("id", a).attr("title", a).text(process);
            l.append(i).append(s);
            var br = $(document.createElement("br")); 
            line.append(d).append(l).append(br);
            div.append(line);
                        
            colorindex++;
        } else {
            var e = $("#"+a);
            var id = e.attr("id");
            if (id) {
                e.text(parseInt(source[a])+"% "+id.substr(id.indexOf('-')+1));
            }
        }
    }
    for(var deviceBlock in deviceBlocks) {
        var header = $(document.createElement("a"));
        header.addClass("device-header").text(deviceBlock).attr("href", "javascript:;").click(function() {
            $("#device-"+device).toggle();
        });
        $("#processes").append(header).append(deviceBlocks[deviceBlock]);
    }
    filterProcesses();
    
    var row = new Array();
    row.push(time);
    
    var a = 0;
    var v = 0;
    for(var r in allcolumns) {
        a = source[allcolumns[r]];
        if (a == null) {
            row.push(null);
        } else {
            if ($("#process_"+allcolumns[r]).attr("checked")) {
                v = parseInt(a);
                row.push(v>0?(v>100?100:v):0);
            } else {
                row.push(null);
            }
        }
    }

    rowQueue.push(row);
    var row = rowQueue[0];
    delete rowQueue[0];
    rowQueue.splice(0,1);

    rows.addRow(row);
    while (rows.getNumberOfRows() > samples) {
        rows.removeRow(0);
    }

    linechart.draw(rows, {
        series: series,
        curveType: "function",
        width: 1200,
        height: 360,
        chartArea: {
            left: 50,
            top: 10,
            width: 1100,
            height: 280,
        },
        vAxis: {
            minValue: 0,
            maxValue: 100,
            logScale: false,
            viewWindowMode: 'explicit',
            viewWindow: {
                min: 0,
                max: 101
            }
        },
        hAxis: {
            viewWindowMode: 'explicit',
            viewWindow: {
                max: samples,
                min: 0
            }
        },
        legend: 'none',
    });
}


function updateDevices(devices) {
    $("#devices").text('');

    for(device in devices) {
        var name = devices[device];
        var l = $(document.createElement("label"));
        var i = $(document.createElement("input"));
        i.attr("id","device_"+device).attr("type","checkbox");
        var s = $(document.createElement("span"));
        s.text(name?name:device).css("margin-left","5px");
        l.append(s);

        var start = $(document.createElement("button")); 
        start.text("Start").attr("id","btnStart_"+device).attr("_device",device).click(function() {
            console.log("Start "+$(this).attr("_device"));

            var device = $(this).attr("_device");
            $("#loading_"+device).show();
            $("#btnStart_"+device).attr("disabled","disabled");
            $("#btnStop_"+device).removeAttr("disabled");

            processData(device);

            deviceList[device] = window.setInterval(function() {
                processData(device);
            }, 1000);
        });
        var stop = $(document.createElement("button")); 
        stop.text("Stop").attr("id","btnStop_"+device).attr("_device",device).attr("disabled","disabled").click(function() {
            console.log("Stop "+$(this).attr("_device"));
            var device = $(this).attr("_device");

            window.clearInterval(deviceList[device]); 
            $("#loading_"+device).hide();
            $("#btnStart_"+device).removeAttr("disabled");
            $("#btnStop_"+device).attr("disabled","disabled");

            jQuery.getJSON("ajax.php?device="+device+"&stop=1&time="+new Date().getTime(), function(data, status, response) {
            });
        });
        var img = $(document.createElement("img")); 
        img.attr("src","loading2.gif").addClass("loading").attr("id","loading_"+device).hide();

        var br = $(document.createElement("br")); 

        $("#devices").append(start).append(stop).append(img).append(l).append(br);
    }
}

function filterProcesses() {
    var filtertext = $("#process-filter").val();
    if (filtertext == "" || filtertext== "*") {
        $(".process-line").show();
    } else {
        $(".process-line").hide();
        $(".process-line[process*='"+filtertext+"']").show();
    }
}

function processData(device) {
    jQuery.getJSON("ajax.php?device="+device+"&op=data", function(data, status, response) {
        if (data && data.op == "data") {
            lastupdate = new Date().getTime();
            displayGraph(data.data);
        }
    });
}

$(window).load(function(){
    $("#btnUpdateDevices").click(function() {
        jQuery.getJSON("ajax.php?devices=1", function(data, status, response) {
            updateDevices(data);
        });
    });

    $("#btnUpdateDevices").click();

    $("#process-filter").bind("keyup", function(a, b, c) {
        if (event.keyCode == 13) {
            filterProcesses();
        }
    })

});
