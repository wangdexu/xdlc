/**
 * Created by dexu on 2017/10/18.
 */
define(['jquery','dhtmlx','ol','../gis/mapControls'],function ($,dhtmlx,ol,mapControl) {
    var _initTree = function(){
        var taskId = getUrlParam("taskId");
            //执行加坐标操作
        var mapData = {"value" :[
            [
                115.17794880671853,
                39.597491680578713,
                0.0,
                115.30203065740066,
                40.049665819358879,
                0.0,
                115.89065895194446,
                39.950581101705168,
                0.0,
                115.76275660876013,
                39.498723153407198,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.20355618262549,
                40.012037035523946,
                0.0,
                115.33285854762985,
                40.462733429223306,
                0.0,
                115.92157369988432,
                40.360517273030773,
                0.0,
                115.78841900914054,
                39.910186815657809,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.23864693192922,
                40.011046163090761,
                0.0,
                115.36809685321873,
                40.463575778094231,
                0.0,
                115.95825879572197,
                40.361241107397561,
                0.0,
                115.82489697223957,
                39.909083812793774,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.38001562934234,
                39.613828369068109,
                0.0,
                115.50931499063056,
                40.069247979778858,
                0.0,
                116.09641127466598,
                39.967178314986803,
                0.0,
                115.96326558484613,
                39.512123999581597,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.49918252296577,
                39.631636200426392,
                0.0,
                115.63039148076841,
                40.084566680376277,
                0.0,
                116.21871626374003,
                39.980570531054809,
                0.0,
                116.08365543307981,
                39.528041299333196,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.49209094717129,
                40.008695634301844,
                0.0,
                115.62249652921005,
                40.464008811670716,
                0.0,
                116.21290635091908,
                40.361631960641759,
                0.0,
                116.07858194296149,
                39.906691769924613,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.6077908124382,
                39.597233222269061,
                0.0,
                115.73218990219125,
                40.046835909884891,
                0.0,
                116.31698067532754,
                39.947603198047211,
                0.0,
                116.18881030076854,
                39.498317024933449,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.63614493153267,
                39.603024475619719,
                0.0,
                115.76377868252941,
                40.058667008390209,
                0.0,
                116.35277000937256,
                39.95744230393921,
                0.0,
                116.22121507517475,
                39.502153639697475,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.6136110811721,
                40.026669843701413,
                0.0,
                115.74594819287016,
                40.479313627675921,
                0.0,
                116.3376706223473,
                40.375005007621709,
                0.0,
                116.20140909068667,
                39.922771045339452,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.71728263978189,
                39.992233631780039,
                0.0,
                115.8427276364406,
                40.44161511434276,
                0.0,
                116.43075467467729,
                40.342115447047199,
                0.0,
                116.30146680391692,
                39.893057741370107,
                0.0,
                0.0,
                0.0,
                0.0
            ],[
                115.70900913399893,
                39.863689848193644,
                0.0,
                115.83682827924682,
                40.317426619939447,
                0.0,
                116.42807963834657,
                40.215994036367213,
                0.0,
                116.29630688050193,
                39.762615147019311,
                0.0,
                0.0,
                0.0,
                0.0
            ]
        ],"url":"http://192.168.31.12:8888/geoserver/wm/wms"}
            //$.ajax({
            //    url:window.restUrl+"api/fs/listioput/"+taskId,
            //    type:"get",
            //    data:"",
            //    async: false,
            //    success:function(data){
            //        //参数1：主视图地图 鼠标移动控件内容(经纬度)挂载点，参数2：地图id挂载点，参数三：将控件放到目标位置挂载点
            //        //mapControl.createMap("ol-mouse-position2","mapMainContainer","post11",mapData.url);
            //        //mapControl.createBox("mapMainContainer",mapData.value);
            //    },
            //    error: function (e) {
            //        if(e.status == "401"){
            //            //getSession();
            //        }
            //    }
            //})
        //参数1：主视图地图 鼠标移动控件内容(经纬度)挂载点，参数2：地图id挂载点，参数三：将控件放到目标位置挂载点
        mapControl.createMap("ol-mouse-position2","mapMainContainer","post11",mapData.url);
        mapControl.createBox("mapMainContainer",mapData.value);
            //获取任务目录
            $.ajax({
                url:window.restUrl+"api/fs/listioput/"+taskId,
                type:"get",
                data:"",
                async: false,
                success:function(data){
                    $("#treeboxbox_tree").empty();
                    // 文件夹左侧树模式
                    $('<li class="nav_item clearfix wjj_leftbs"  title="'+data.path+'" data-pid="'+data.id+'"  data-id="'+data.id+'"  data-type="0" >' +
                        '							<i></i>' +
                        '							<u></u>' +
                        '							<p>'+data.path+'</p>' +
                        '							<div  class="nav_item_sWrap clearfix">' +
                        '<li style="margin-left: 10px;" class="nav_item clearfix wjj_leftbs" id="' + data.children[0].id + '" title="' + data.children[0].path + '" data-pid="' + data.children[0].id + '"  data-id="' + data.children[0].id + '" data-type="0">' +
                        '<i></i>' +
                        '<u></u>' +
                        '<p>' + data.children[0].path + '</p>' +
                        '<div id="par' + data.children[0].id + '" class="nav_item_sWrap clearfix"></div>' +
                        '</li>' +
                        '<li style="margin-left: 10px;" class="nav_item clearfix wjj_leftbs" id="' + data.children[1].id + '" title="' + data.children[1].path + '" data-pid="' + data.children[1].id + '"  data-id="' + data.children[1].id + '" data-type="0">' +
                        '<i></i>' +
                        '<u></u>' +
                        '<p>' + data.children[1].path + '</p>' +
                        '<div id="par' + data.children[1].id + '" class="nav_item_sWrap clearfix"></div>' +
                        '</li>' +
                        '</div>' +
                        '</li>'
                    ).appendTo($("#treeboxbox_tree"));
                },
                error: function (e) {
                    if(e.status == "401"){
                        //getSession();
                    }
                }
            })


         //文件夹点击展开
        $("#treeboxbox_tree").delegate(".nav_item", "click", function() {
            $(this).children(".nav_item_sWrap").toggle();
            $(this).children("i").toggleClass("navWrapActive");
            $(this).children("p").attr("class","selected");
        })
        var clickObject;
        var treeClickDiv;
        $("#treeboxbox_tree").delegate(".wjj_leftbs", "click", function(event) {
            event.stopPropagation();
            var ids = $(this).attr("id");
            var dataType = $(this)[0].dataset.type;
            if(dataType == 0){
                treeClickDiv = $("#par"+ids);
                $.ajax({
                    url:window.restUrl+"api/fs/listbydirid/"+ids,
                    type:"get",
                    data:"",
                    async: false,
                    success:function(childdata){
                        //if(data.hasOwnProperty("flow")) {
                        //$(".titleLabel").text(data.path);
                        // var childData = childdata;
                        // childData = formatChildData(tempOutData,childData,treeClickId);
                        //console.log(JSON.stringify(taskData));
                        // $('#jstreeDiv').jstree({ 'core': { data: null } });
                        // $('#jstreeDiv').jstree(true).settings.core.data = childData;
                        // $('#jstreeDiv').jstree(true).refresh()
                        treeClickDiv.empty();
                        var childData = childdata;
                        childData.forEach(function (c) {
                            if(c.type == "dir"){
                                $('<li class="nav_item clearfix wjj_leftbs" id="' + c.id + '" title="' + c.path + '" data-pid="' + c.id + '"  data-id="' + c.id + '" data-type="0">' +
                                    '<i></i>' +
                                    '<u></u>' +
                                    '<p>' + c.path + '</p>' +
                                    '<div id="par' + c.id + '" class="nav_item_sWrap clearfix"></div>' +
                                    '</li>').appendTo(treeClickDiv);
                            }else{
                                $('<li style="margin-left: 20px;" class="nav_item clearfix wjj_leftbs" data-text="'+c.path+'" data-type="'+c.type+'" data-url="'+c.url+'" title="' + c.path + '" data-pid="' + c.id + '"  data-id="' + c.id + '" data-type="1">' +
                                        //'<i></i>' +
                                        //'<u></u>' +
                                    '<input  type="checkbox" class="last_level"/>'+
                                    '<p>' + c.path + '</p>' +
                                    '<div id="par' + c.id + '" class="nav_item_sWrap clearfix"></div>' +
                                    '</li>').appendTo(treeClickDiv);
                            }
                        })
                    },
                    error: function (e) {
                        if(e.status == "401"){
                            //getSession();
                        }
                    }
                })
            }else{
                //获得input里面的tiff切片数据
                //if(暂定){
                //$.ajax({
                //    url:baseUrl+"api/fs/listbydirid/"+ids,
                //    type:"get",
                //    data:"",
                //    async: false,
                //    success:function(data){
                //        $(this).attr("data-url",""+data)
                //    },
                //    error: function (e) {
                //        if(e.status == "401"){
                //            getSession();
                //        }
                //    }
                //})
                //}
                var text = $(this)[0].dataset.text;
                var type = $(this)[0].dataset.type;
                var url = $(this)[0].dataset.url;
                var data = {
                    "node":{
                        "original":{ "text":text,
                            "type":type,
                            "url":url}
                    }
                };
                var tempType
                if(data.node.original.text !=undefined && data.node.original.text != null){
                    var typeArr = data.node.original.text.split(".");
                    tempType = typeArr[typeArr.length-1];
                }
                if(data.node.original.type != "url"){
                    if(tempType == "gcp" || tempType == "rpb" || tempType == "tie" || tempType == "text" || tempType == "db" || tempType == "txt" || tempType == "aux" || tempType == "rrd"){
                        data.node.original.type = "text";
                    }else if(tempType.toLowerCase() == "tiff" || tempType.toLowerCase() == "tif" || tempType.toLowerCase() == "shp"){
                        data.node.original.type = "url";
                    }else if(tempType == "xml"){
                        data.node.original.type = "xml";
                    }else if(tempType == "json"){
                        data.node.original.type = "json";
                    }else if(tempType == "jpg"){
                        data.node.original.type = "jpg";
                    }
                }


                //勾选框
                clickObject=this;
                var number=$(this).children("p").html().split("_")[3];
                $("p:contains("+number+")").prev().prop("checked",false);
                if(data.node.original.type != "url"){
                    map=undefined;
                    $(".last_level").prop("checked",false);
                }
                $(this).children(".last_level").prop("checked",true);

                //data.node.original.type = "url";
                if(data.node.original.type == "file"){
                    //lookText(data.node.original.text)
                }else if(data.node.original.type == "url"){

                    var path = data.node.original.url;
                    var url =  path.split("?")[0];
                    var theRequest = new Object();
                    if (path.indexOf("?") != -1) {
                        var str = path.substr(1);
                        var strs = str.split("&");
                        for(var i = 0; i < strs.length; i ++) {
                            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                        }
                    }
                    var imgType = "image/png";
                    var layer = theRequest.layers;
                    var bbox;
                    if(theRequest.bbox != undefined){
                        bbox = theRequest.bbox.split(",");
                    }
                    //lookUrl(url,layer,bbox,"wms",imgType);
                    //lookUrl("","","","wms");
                }else if(data.node.original.type == "text"){
                    var path = data.node.original.url;
                    //var path = "aaa.text";
                    //lookText(path)
                }else if(data.node.original.type == "xml"){
                    var path = data.node.original.url;
                    //var path = "installer.xml";
                    //lookXml(path)
                }else if(data.node.original.type == "json"){
                    var path = data.node.original.url;
                    //var path = "installer.xml";
                    //lookJson(path)
                }else if(data.node.original.type == "jpg"){
                    var path = data.node.original.url;
                    //var path = "installer.xml";
                    //lookJpg(path)
                }
            }

        })

        function getUrlParam(name){
            var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null){
                return unescape(r[2])
            }else{
                return null;
            }
        }
    }
    return {
        initTree:_initTree
    };
})
