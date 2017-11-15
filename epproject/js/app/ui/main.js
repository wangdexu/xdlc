/**
 * Created by domea on 17-6-2.
 */
define(['jquery','dhtmlx','ol','../gis/mapControls','../gis/smallMap','../gis/produce','../leftTree/leftTree'],function ($,dhtmlx,ol,mapControl,smallMap,produce,tree) {
    var _test=function(){
        document.oncontextmenu = function(){
            return false;
        }
        window.restUrl;
        //默认第一个map
        var mapId = "div0";
        //保存所以得mapid
        var mapIdArr = [];
        //联动保存选中项mapId
        var checkTemp = {};
        //全选保存选中项mapId
        var checkAllTemp = {};
        //是否选中联动按钮
        var isLink = false;
        //添加编辑后零时保存点
        var pointTemp;
        //保存当前点
        var nowPoint = [];
        //保存主视图所有的点
        var manPoints = [];

        //地图操作互斥对象
        var isEdit = {"addPoint":true,"stabPoint":true,"modifyPoint":true,"deleteSingle":true,"deleteAll":true};

        window.dhx4.skin = 'material';
        var main_layout = new dhtmlXLayoutObject(document.body, '2U');

        var leftDiv = main_layout.cells('a');
        leftDiv.setWidth('200');
        leftDiv.fixSize(1,0);
        leftDiv.hideHeader();
        leftDiv.attachHTMLString('<label class="leftLabel">HERBERT</label><div id="treeboxbox_tree" class="fileList">文件列表</div>');  //左侧的文件列表
        //var tree=new dhtmlXTreeObject("treeboxbox_tree","100%","100%",0);
        //tree.setImagePath("codebase/imgs/");
        //tree.enableDragAndDrop(false);
        //tree.enableTreeLines(false);
        //tree.setImageArrays("plus","","","","./csh_bluebooks/plus.gif");
        ////设置通用展开图示:
        //tree.setImageArrays("minus","","","","./csh_bluebooks/minus.gif");
        ////通用收起图示:
        //tree.setStdImages("./csh_bluebooks/book.gif",
        //    "./csh_bluebooks/folderOpen.gif","./csh_bluebooks/folderClosed.gif");
        //tree.loadJSONObject({id:0,
        //        item:[
        //            {id:1,text:"first",userdata:[{name:'url',content:'http://g.cn#1'}]},
        //            {id:2, text:"middle",userdata:[{name:'url',content:'http://g.cn#2'}],
        //                item:[
        //                    {id:"21", text:"child",userdata:[{name:'url',content:'http://g.cn#3'}]}
        //                ]},
        //            {id:3,text:"last",userdata:[{name:'url',content:'空'}]}
        //        ]
        //    }
        //);

        var rightDiv = main_layout.cells('b');
        rightDiv.hideHeader();

        //界面参数
        var ribbon_1 = rightDiv.attachRibbon({
            skin : "material", icons_path : "./img/", items : [
                    {id : "project", text : "工程", text_pos : "buttom", type : "block", mode : "cols", list : [
                    {id : "close", text : "关闭",img : "close.png",isbig : true,  type : "button"},
                    {id : "open", text : "提交",img : "submit.png", isbig : true, type : "button"},
                    {id : "export", text : "导入导出",img : "import.png",isbig : true,  type : "button"},
                    {id : "save", text : "保存",img : "import.png",isbig : true,  type : "button"},
                    {id : "imageRange", text : "影像范围", type : "checkbox", checked : true},
                    {id : "imageControl", text : "影像", type : "checkbox", checked : true},
                    {id : "controlPoint", text : "控制点", type : "checkbox", checked : true},
                    {id : "linkPoint", text : "连接点", type : "checkbox", checked : true},
                    {id : "checkPoint", text : "检查点", type : "checkbox", checked : true},
                    {id : "pointID", text : "点ID", type : "checkbox", checked : true}
                ]},
                {id : "tools", text : "工具", text_pos : "buttom", type : "block", mode : "cols", list : [
                    {id : "zoomIn", text : "放大",img:"big.png",isbig : true, type : "button"},
                    {id : "zoomOut", text : "缩小",img:"small.png",isbig : true, type : "button"},
                    {id : "translate", text : "平移",img : "move.png", isbig : true, type : "button"},
                    {id : "fullView", text : "全图",img:"allimage.png",isbig : true, type : "button"},
                    {id : "setPointCenter", text : "当前点居中",img:"point_center.png", isbig : true, type : "button"},
                    {id : "oneRatioOne", text : "1:1显示", img : "1show.png", isbig : true, type : "button"},
                    //{id : "group_1", text : "group_1", type : "group", list : [
                    //    {id : "contrast", text : "对比度", type : "text"},
                    //    {id : "hue", text : "", type : "slider",  size : 100, min : -180, max : 180,value:0, step : 1, margin : 10}
                    //]},
                    //{id : "group_2", text : "group_2", type : "group", list : [
                    //
                    //    {id : "sharpening", text : "锐&nbsp&nbsp&nbsp化", type : "text"},
                    //    {id : "chroma", text : "", type : "slider", size : 100, min : 0, max : 100,value:100, step : 1, margin : 10}
                    //]},
                    //{id : "group_3", text : "group_2", type : "group", list : [
                    //
                    //    {id : "light", text : "亮&nbsp&nbsp&nbsp度", type : "text"},
                    //    {id : "lightness", text : "", type : "slider", size : 100, min : 0, max : 100,value:100, step : 1, margin : 10}
                    //]}

                ]},
                {id : "edit", text : "编辑", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "addPoint", text : "添加点",img:"plus_point.png", isbig : true, type : "button"},
                    {id : "stabPoint", text : "刺点",img:"hit_point.png", isbig : true, type : "buttonTwoState"},
                    {id : "modifyPoint", text : "修改点",img:"change_point.png", isbig : true, type : "buttonTwoState"},
                    {id : "deleteSingle", text : "删除点",img:"delete_point.png",isbig : true, type : "buttonTwoState"},
                    {id : "deleteAll", text : "删除所有点", img:"delete_all_point.png",isbig : true,type : "button"},
                    //{id : "delete", text : "删除",img:"删除点48px.png", isbig : true, type : "buttonSelect", items : [
                    //    {type : "item", buttonid : "deleteSingle",img:"删除点22px.png", text : "删除点"},
                    //    {type : "item", buttonid : "deleteAll",img:"删除所有点22px.png", text : "删除所有点"}
                    //]},
                    {id : "autoPrediction", text : "自动预测",img:"auto.png",isbig : true, type : "button"},
                    {id : "associatedDisplay", text : "关联显示",img:"view_connect.png",isbig : true, type : "checkbox"}
                    //,{id : "checkAll", text : "全选",img:"view_connect.png", type : "checkbox"}

                ]},
                {id : "kongThreeProcess", text : "空三处理", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "autoMatch", text : "自动匹配",img:"auto_match.png", isbig : true, type : "button"},
                    {id : "blockAdjustment", text : "区域网平差",img:"network.png", isbig : true, type : "button"}
                ]}
            ]
        });
        var layout_1 = rightDiv.attachLayout('3T');
        var cell_1 = layout_1.cells('a');
        cell_1.hideHeader();

        //添加地图容器、试图控制选项卡
        cell_1.attachHTMLString('<div id="mapShow">' +
        '<div class="showMapTemplate">'+
            '<div class="list-container">'+
            '<ul class="main-view">'+
            '<li  class="name mainView"  >主视图</li>'+
            '<li class="number tabLi" >'+
            '<span class="idName"></span>'+
            //'<span class="delete">&times;</span>'+
            '</li>'+
            '</ul>'+
            '</div>'+
          '<div class="sub-view">'+
                '<div class="mapMainContainer" id="mapMainContainer"></div>' +
                 '<div class="idMapContainer"></div>'+
           '</div>'+
        '</div>' +
'</div>');
        var cell_2 = layout_1.cells('b');
        cell_2.setText('点列表');
        cell_2.setHeight('200');
        cell_2.fixSize(0,1);
        var grid_3 = cell_2.attachGrid();
        grid_3.setIconsPath('./codebase/imgs/');
        grid_3.setHeader(["序号","点ID","点类型","重叠度","有效","经度","纬度","高程"]);
        grid_3.setColTypes("ro,ro,coro,ro,edtxt,edtxt,edtxt,edtxt");
        var combobox = grid_3.getCombo(2);
        combobox.put("ControlPoint","ControlPoint");
        combobox.put("TiePoint","TiePoint");
        combobox.put("CheckPoint","CheckPoint");
        //combobox.setHeight('200');
        //grid_3.enableAutoHeight(true);
        //grid_3.init();
        grid_3.setColSorting('str,str,str,str,str,str,str,str');
        grid_3.setInitWidths('*,*,*,*,*,*,*,*');
        grid_3.init();
        grid_3.enableMultiselect(true);
        grid_3.load('./data/grid0.xml','xml');

      //存储每个创建的小地图，用于地图联动
       var mapLinkMove = [];
       //创建小地图
        var creatDiv = function(rId,data,pointId){
            //如果已经创建过smallMap，则显示以前的
            grid_3.forEachRow(function(id){
                if(id == rId){
                    //document.getElementById("mapArr"+id).style.display = "block";
                    $("#mapArr"+id).css("display","block");
                }else{
                    if(document.getElementById("mapArr"+id) != undefined){
                        //document.getElementById("mapArr"+id).style.display = "none";
                        $("#mapArr"+id).css("display","none");
                    }
                }
            });
            if(document.getElementById("mapArr"+rId) == undefined){

                //如果没有创建过small，则创建新的
                //$(".idMapContainer").empty();   //小地图地图容器每次创建前将前一次的小地图清空
                $(".idMapContainer").append('<div id="mapArr'+rId+'" style="height: 325px;cursor:crosshair;"></div>');
                //document.getElementById("mapArr").innerHTML = '';
                mapLinkMove = [];
                //var mapCount = parseInt(arr[0].mapCount);
                for(var i=0;i<data.rows.length;i++){
                    //var smallMap =  mapControl.createSmallMap("ol-mouse-position","tabContent"+i);  // 调用地图，第一个参数，鼠标移动控件挂载点，第二个参数：地图控件挂载点
                    //mapLinkMove.push(smallMap);
                    //var url = "";//urlArr[i];
                    var tempId = data.rows[i].data[3];
                    var oDiv = document.createElement('div');
                    var checkDiv = document.createElement('div');
                    //checkDiv.style.height = "6%";
                    checkDiv.style.zIndex = "100";
                    checkDiv.style.position = "absolute";
                    checkDiv.style.marginLeft= "18%";
                    checkDiv.innerHTML = '<input type="checkbox" style="float: right;" name="'+tempId+'" type="checkbox">';
                    //checkAllTemp["div"+rId+i] = "div"+rId+i;
                    checkAllTemp[tempId] = tempId;
                    checkDiv.onclick = function(event){
                        if(event.toElement.checked == true){
                            event.toElement.name;
                            checkTemp[event.toElement.name] = event.toElement.name;
                            //如果联动为选中状态，新选择地图增加联动监听
                            //if(isLink == true){
                                smallMap.moveMap(checkTemp);
                            //}
                        }else{

                            //如果联动为选中状态，取消地图选择移除取消的地图监听并重新增加监听
                            //if(isLink == true) {
                                smallMap.unMoveMap(checkTemp);
                                checkTemp[event.toElement.name] = "";
                                smallMap.moveMap(checkTemp);
                            //}
                        }
                    }

                    oDiv.appendChild(checkDiv);
                    oDiv.style.height = "299px";
                    oDiv.style.width = "19.8%";
                    oDiv.style.float = "left";
                    oDiv.style.marginLeft = "0.2%";
                    //oDiv.id = "div"+rId+i;
                    oDiv.id = tempId;
                    mapIdArr.push(oDiv.id);
                    if(i == "0"){
                        mapId = oDiv.id;
                        oDiv.style.border = "1px red solid";
                    }else{
                        oDiv.style.border = "1px #989696 solid";
                    }
                    oDiv.onclick = function(event){
                        mapId = event.currentTarget.id;
                        document.getElementById(mapId).style.border = "1px red solid";
                        for(var i=0;i<data.rows.length;i++){
                            if(mapId != data.rows[i].data[3]){
                                document.getElementById(data.rows[i].data[3]).style.border = "1px #989696 solid";
                            }
                        }
                    }

                    document.getElementById("mapArr"+rId).appendChild(oDiv);
                    //var wmtsUrl = "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/";
                    var url = data.rows[i].data[8];
                    var rows = data.rows[i].data[6];
                    var cols = data.rows[i].data[5];
                    var uuid = data.rows[i].data[0];
                    //var pointId = data.rows[i].data[1];
                    var mapTemp = smallMap.createMap(uuid,url,oDiv.id,rows,cols,pointId);
                }
                i=null;
            }
        };
        //记录影像列表的值
        var grid3Detail = {"8":{"rows": [{"id":1,"data":["aaa","1","8","img0","2","1","13147.054622607193","13907.669428881965","http://192.168.4.2:18080/geowebcache/service/wms?VERSION:1.1.1&layers=GF2_PMS1_E113.6_N40.1_20160308_L1A0001458090-PAN1_20171020"]},
            {"id":2,"data":["bbb","2","8","img1","2","1","17841.913952814564","20549.190592890045","http://192.168.4.2:18080/geowebcache/service/wms?VERSION:1.1.1&layers=GF2_PMS1_E113.6_N40.1_20160308_L1A0001458090-PAN1_20171020"]},
            {"id":3,"data":["ccc","3","8","img2","2","1","21325.1966816781","5898.776260519281","http://192.168.4.2:18080/geowebcache/service/wms?VERSION:1.1.1&layers=GF2_PMS1_E113.6_N40.1_20160308_L1A0001458090-PAN1_20171020"]}]}}
        //记录点列表选中的ID
        var pointId;
        var mapCount;
        var arr = [];
        // 每次单击一行，取得那一行的信息
        grid_3.attachEvent('onRowSelect', function(rId, cInd) {
            _removeState();
            pointId = grid_3.cells(rId, 1).getValue();  //取得点Id
            if (grid3Detail[pointId] == undefined) {
                grid3Detail[pointId] = {"rows": []};
            }            if(cInd == 3){
                var obj = {};
                obj.id = rId;   //行ID

                nowPoint = [grid_3.cells(rId, 5).getValue(), grid_3.cells(rId, 6).getValue()];
                //给右侧影像列表赋值
                var data = grid3Detail[pointId];
                grid_2.clearAll();
                grid_2.parse(data, function () {
                    //alert(1);
                }, "json");
                obj.mapCount = grid_3.cells(rId, 3).getValue();  //取得重叠度
                if (!arr[0]) {      // 第一次选择一行
                    arr.push(obj);
                } else {     //判断选择的这一行是否已经存在了
                    if (parseInt(arr[0].id) === parseInt(obj.id)) {
                        return arr;
                    } else {
                        arr.pop(arr[0]);
                        arr.push(obj);
                    }
                }
                $(".tabLi").css({"display": "block"});   //选择一行，显示其对应的选项卡
                $('.idName').html(pointId);              // 将选择的那一行显示到选项卡
                _showSubView();
                creatDiv(rId,data,pointId);       //创建每副小地图容器，并且调用地图
                return arr;
            }
        });
        function _showSubView(){
            $mainViewFlag = false;
            $subViewFlag = true;
            $(".idMapContainer").css({"display":"block"});
            $('.mapMainContainer').css({"display":"none"});
            $(".tabLi").addClass('name');
            $(".mainView").removeClass('name').addClass('number');
        }
        var status_1 = layout_1.attachStatusBar();
        //主视图鼠标移动显示经纬度控件挂载点
        status_1.setText("<div class='progress' style='width: 20%;float: left;'><div id='progress-bar' class='progress-bar' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: 50%;'>" +
        " <span class='sr-only'>40% 完成</span></div></div>" +
        "<div id='post11'><div class='ol-mouse-position2'></div></div>");
        $("#post11").css({
            "position": "relative",
            "top": "0",
            "left": "70%",
            "width": "240px",
            "height": "30px",
            "line-height":"30px",
            "text-align":"center"
        });

        //主视图和分视图是否显示
        var $mainViewFlag = true;
        var $subViewFlag = false;
        var tabChange = function(){  //切换主视图、分视图
            $(".mainView").on('click',function(){
                $subViewFlag = false;
                if($mainViewFlag){
                    return;
                }else{
                    $mainViewFlag = true;
                    $(this).addClass('name');
                    $(".tabLi").removeClass('name');
                    $('.mapMainContainer').css({"display":"block"});
                    $(".idMapContainer").css({"display":"none"});
                }
            });
            $(".tabLi").on('click',function(){
                $mainViewFlag = false;
                if($subViewFlag){
                    return;
                }else{
                    $subViewFlag = true;
                    $(this).addClass('name');
                    $(".mainView").removeClass('name').addClass('number');
                    $(".idMapContainer").css({"display":"block"});
                    $('.mapMainContainer').css({"display":"none"});
                }
            });
            //删除分视图
            $(".delete").on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                $subViewFlag = false;
                $(".tabLi").removeClass('name').fadeOut();
                $(".mainView").addClass('name');
                $('.mapMainContainer').css({"display":"block"});
                $(".idMapContainer").empty().fadeOut();
            })
        };
        $(function(){
            //参数1：主视图地图 鼠标移动控件内容(经纬度)挂载点，参数2：地图id挂载点，参数三：将控件放到目标位置挂载点
            //mapControl.createMap("ol-mouse-position2","mapMainContainer","post11","");
            tabChange(); //调用
        });
        var grid_2 ;
        var cell_3 = layout_1.cells('c');
        cell_3.setText('影像列表');
        cell_3.setHeight('200');
        cell_3.fixSize(0,1);

         grid_2 = cell_3.attachGrid();
        grid_2.setIconsPath('./codebase/imgs/');

        grid_2.setHeader(["","序号","点ID","影像ID","影像名称","有效","X","Y"]);
        grid_2.setColTypes("ro,ro,ro,ro,ro,edtxt,edtxt,edtxt");
        grid_2.setStyle(
            "","overflow-x: hidden !important;","color:red;",""

        );
        grid_2.setColSorting('str,str,str,str,str,str,str,str');
        grid_2.setInitWidths('0,*,*,*,*,*,*,*');
        grid_2.init();
        grid_2.enableMultiselect(true);
        //grid_2.load('./data/grid.xml','xml');

        //接收影像列表信息
        var _returnDetail =  function(Detail){
            grid3Detail = Detail;
        }
        //接收疵的点
        var _returnCiPoint =  function(point,points){
            nowPoint = point;
            manPoints = points;
        }
        //接收添加的点
        var _returnAddPoint = function(point,newData){
            pointTemp = point;
            grid3Detail[pointId].rows.push(newData);
        }
        //接收编辑的点
        var _returnEditPoint = function(point,pointData){
            pointTemp = point;
            grid3Detail[pointId] = pointData;
        }
        //接收预测的信息
        var _returnPrediction = function(grid3Detail,rId){
            grid3Detail[pointId] = grid3Detail;
            creatDiv(rId,grid3Detail[pointId],pointId);
        }
        //接收选中的点
        var _returnSelectLint = function(points){
            points;
        }
        //接收删除的点
        var _returnRemovePoint = function(points,pointData){
            points;
            grid3Detail[pointId] = pointData;
        }
        //接收删除全部的点
        var _returnRemoveAllPoint = function(pointData){
            for(var k in grid3Detail){
                grid3Detail[k].rows = [];
            }
            //grid3Detail.forEach(function(item){
            //    item.rows = [];
            //})
        }
        //接收编辑后的线
        var _returnLine = function(line){
            line;
        }
        //监听锐化、对比度、亮度值是否改变
       var __listenValue = function (){
           ribbon_1.attachEvent("onValueChange",function(id,value){
               //改变处理地图，默认处理主视图，处理小地图 请判断添加代码
               mapControl.changeColor(id,value,"mapMainContainer")
           });
       };
        ribbon_1.attachEvent("onValueChange",function(id,value){
            //改变处理地图，默认处理主视图，处理小地图 请判断添加代码
            mapControl.changeColor(id,value,"mapMainContainer")
        });
        //按钮互斥方法
        var _removeState = function(){
            ribbon_1.setItemState("modifyPoint", "false", "");
            ribbon_1.setItemState("deleteSingle", "false", "");
            ribbon_1.setItemState("stabPoint", "false", "");
            $(".mapMainContainer").css({"cursor": "default"});
            mapControl.removeAdd();
            smallMap.removeAdd(mapId);
            mapControl.removeAdd();
            smallMap.removeAdd(mapId);
        }
        //监听菜单是否点击了
        ribbon_1.attachEvent("onClick", function(id) {
            switch(id){
                case "open":
                    //$.ajax({
                    //    url:window.restUrl+"api/fs/listioput/"+taskId,
                    //    type:"get",
                    //    data:"",
                    //    async: false,
                    //    success:function(data){
                    //
                    //        alert("提交成功！");
                    //    },
                    //    error: function (e) {
                    //        if(e.status == "401"){
                    //            //getSession();
                    //        }
                    //    }
                    //})
                    _removeState();
                   console.log(id);
                    break;
                case "close":
                    _removeState();
                    if
                    (confirm("您确定要关闭本系统吗？")){
                        window.opener=null;
                        window.open('','_self');
                        window.close();
                    }
                    else{}
                    console.log(id);
                    break;
                case "export":
                    _removeState();
                    mapControl.export({
                        eventName:"onClick"
                    });
                    break;
                case "save":
                    mapProduce.saveDate({
                        eventName:"onClick",
                        arg: []
                    });
                    break;
                case "zoomIn":
                    _removeState();
                    if($mainViewFlag == true) {
                        $("#mapMainContainer").css({"cursor": "crosshair"});
                        mapControl.zoomIn({
                            eventName: "onClick",
                            arg: []
                        });
                    }else{
                        if(isLink == true){
                            for(var cid in checkTemp){
                                if (checkTemp[cid] != "" && checkTemp[cid] != undefined) {
                                    smallMap.toBig({
                                        eventNme: "onClick",
                                        arg: [id,cid]
                                    });
                                };
                            }
                        }else {
                            smallMap.toBig({
                                eventNme: "onClick",
                                arg: [id, mapId]
                            });
                        }
                    }
                    break;
                case "zoomOut":
                    _removeState();
                    if($mainViewFlag == true) {
                        $("#mapMainContainer").css({"cursor": "crosshair"});
                        mapControl.zoomOut({
                            eventName: "onClick"
                            //  arg: [id,"mapMainContainer"]
                        });
                    }else{
                        if(isLink == true){
                            for(var cid in checkTemp){
                                if (checkTemp[cid] != "" && checkTemp[cid] != undefined) {
                                    smallMap.toSmall({
                                        eventNme: "onClick",
                                        arg: [id,cid]
                                    });
                                };
                            }
                        }else {
                            smallMap.toSmall({
                                eventNme: "onClick",
                                arg: [id, mapId]
                            });
                        }
                    }
                    break;
                case "fullView":
                    _removeState();
                    if($mainViewFlag == true) {
                        mapControl.fullView({
                            eventName: "onClick"
                            //arg: [id,mapId]
                        });
                    }else{
                        if(isLink == true){
                            for(var cid in checkTemp){
                                if (checkTemp[cid] != "" && checkTemp[cid] != undefined) {
                                    smallMap.fullView({
                                        eventNme: "onClick",
                                        arg: [id,cid]
                                    });
                                };
                            }
                        }else{
                            smallMap.fullView({
                                eventNme: "onClick",
                                arg: [id,mapId]
                            });
                        }
                    }
                    break;
                case "translate":
                    _removeState();
                    $(".mapMainContainer").css({"cursor":"move"});
                    //mapControl.translate({
                    //    eventName:"onClick"
                    //    //arg: [id,mapId]
                    //});
                    break;
                case "setPointCenter":
                    _removeState();
                    if($mainViewFlag == true) {
                        mapControl.setPointCenter({
                            eventNme: "onClick",
                            arg: [id, mapId, nowPoint]
                        });
                    }else{
                        if(isLink == true){
                            for(var cid in checkTemp){
                                if (checkTemp[cid] != "" && checkTemp[cid] != undefined) {
                                    smallMap.setPointCenter({
                                        eventNme: "onClick",
                                        arg: [id, cid, nowPoint]
                                    });
                                };
                            }
                        }else {
                            smallMap.setPointCenter({
                                eventNme: "onClick",
                                arg: [id, mapId, nowPoint]
                            });
                        }
                    }

                    break;
                case "oneRatioOne":
                    _removeState();
                    if($mainViewFlag == true) {
                        mapControl.oneRatioOne({
                            eventName: "onClick"
                            //arg: [id,mapId]
                        });
                    }else{
                        if(isLink == true){
                            for(var cid in checkTemp){
                                if (checkTemp[cid] != "" && checkTemp[cid] != undefined) {
                                    smallMap.oneToOne({
                                        eventNme: "onClick",
                                        arg: [id, cid]
                                    });
                                };
                            }
                        }else {
                            smallMap.oneToOne({
                                eventNme: "onClick",
                                arg: [id, mapId]
                            });
                        }
                    }
                    break;
                case "addPoint":
                    _removeState();
                    if($mainViewFlag == true){
                        $(".mapMainContainer").css({"cursor":"default"});
                        mapControl.addPoint({
                            eventName:"onClick",
                            arg: [grid_3]
                        });
                    }

                    break;



                case "deleteAll":
                    _removeState();
                    //if($mainViewFlag == true) {
                        mapControl.deleteAllPoint({
                            eventName: "onClick",
                            arg: [grid_3]
                        });
                    //}else{
                        //mapIdArr.forEach(var mapCheckId in mapIdArr){
                        //        if (mapIdArr[mapCheckId] != "" && mapIdArr[mapCheckId] != undefined) {
                        //            smallMap.removePoint({
                        //                eventNme: "onClick",
                        //                arg: [id, grid_2, mapCheckId,_returnRemovePoint,grid3Detail[pointId],pointId]
                        //            });
                        //        };
                        //    }
                        mapIdArr.forEach(function(mapId){
                            smallMap.removePoint({
                                eventNme: "onClick",
                                arg: [id, grid_2, mapId,_returnRemoveAllPoint,grid3Detail[pointId],pointId]
                            });
                        })
                    //}
                    break;_returnRemoveAllPoint
                case "autoPrediction":
                    _removeState();
                    //$(".autoMatch").addClass("autoMatchLoading").fadeIn(500);
                    //这里写的只是测试加载动画，真实情况要从后台处理数据进度判断动画消失的时间
                    //setTimeout(function(){
                    //    $(".autoMatch").removeClass('.autoMatchLoading').fadeOut(500);
                    //},10000);
                    var pointArr = grid_3.getSelectedRowId().split(",");
                    pointArr.forEach(function(id){
                        var pointId = grid_3.cells(id, 1).cell.innerHTML
                        mapControl.auto({
                            eventName: "onClick",
                            arg: [grid_3,grid_2,taskData,_returnPrediction,grid3Detail[pointId]]
                        })
                    })
                    break;
                case "associatedDisplay":
                    _removeState();
                    //mapControl.mapLinkMove({
                    //    eventName:"onclick",
                    //    args:[mapLinkMove]
                    //});
                    if(state == true){
                        isLink = true;
                        smallMap.moveMap(checkTemp);
                    }else{
                        isLink = false;
                        smallMap.unMoveMap(checkTemp);
                    }
                    break;


                case "autoMatch":
                    _removeState();
                    $(".autoMatch").addClass("autoMatchLoading").fadeIn(500);
                    //这里写的只是测试加载动画，真实情况要从后台处理数据进度判断动画消失的时间
                    setTimeout(function(){
                        $(".autoMatch").removeClass('.autoMatchLoading').fadeOut(500);
                    },1000);
                    produce.autoMatch({
                        eventName:"onClick",
                        arg: [grid_3,grid_2,grid3Detail,_returnDetail,taskData]
                    });
                    break;
                case "blockAdjustment":
                    _removeState();
                    produce.blockAdjustment({
                        eventName:"onClick",
                        arg: [grid_3,grid_2,taskData]
                    });
                    break;
            }
        });
        ribbon_1.attachEvent("onStateChange", function(id, value){
            //your code here
            switch(id){
                case "stabPoint":
                    ribbon_1.setItemState("modifyPoint", "false", "");
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    if(value == true) {
                        $(".mapMainContainer").css({"cursor": "crosshair"});
                        // $(".mapMainContainer").css({"cursor":"default"});
                        mapControl.stabPoint({
                            eventName: "onClick",
                            arg: [grid_3, _returnCiPoint]
                        });
                        $("." + mapId).css({"cursor": "crosshair"});
                        smallMap.addPoint({
                            eventNme: "onClick",
                            arg: [id, grid_2, mapId, _returnAddPoint, pointId]
                        });
                    }else{
                        $(".mapMainContainer").css({"cursor": "default"});
                        mapControl.removeAdd();
                        smallMap.removeAdd(mapId);
                    }
                    break;
                case "modifyPoint":
                    ribbon_1.setItemState("stabPoint", "false", "");
                    ribbon_1.setItemState("deleteSingle", "false", "");
                    if($mainViewFlag == true) {
                        $(".mapMainContainer").css({"cursor": "pointer"});
                        mapControl.modifyPoint({
                            eventName: "onClick",
                            arg: [grid_3]
                        });
                        smallMap.editPoint({
                            eventNme: "onClick",
                            arg: [id, grid_2, mapId, _returnEditPoint, grid3Detail[pointId], pointId]
                        });
                    }else{
                        $(".mapMainContainer").css({"cursor": "default"});
                        mapControl.removeAdd();
                        smallMap.removeAdd(mapId);
                    }
                    break;
                case "deleteSingle":
                    if(value == true){
                        ribbon_1.setItemState("stabPoint", "false", "");
                        ribbon_1.setItemState("modifyPoint", "false", "");
                        $(".mapMainContainer").css({"cursor": "pointer"});
                        if($mainViewFlag == true) {
                            mapControl.deleteSinglePoint({
                                eventName: "onClick",
                                arg: [grid_3]
                            });
                        }else{
                            smallMap.removeOnePoint({
                                eventNme: "onClick",
                                arg: [id,grid_2,mapId,_returnRemovePoint,grid3Detail[pointId],pointId]
                            });
                        }
                    }else{
                        $(".mapMainContainer").css({"cursor": "default"});
                    }
                    break;
            }
        });
        ribbon_1.attachEvent('onCheck', function(id, state){
           switch(id){
               case "imageRange":
                   mapControl.showImgRange(state);
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "imageControl":
                   mapControl.showImgLayer(state);
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "controlPoint":
                   mapControl.showControlPoint(state,grid_3);
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "linkPoint":
                   mapControl.showTiepointPoint(state,grid_3);
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "checkPoint":
                   mapControl.showCheckPoint(state,grid_3);
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "pointID":
                   mapControl.showPoint(state);
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "contrast":
                   console.log(state);
                   if(state){
                       __listenValue();
                   }
                   break;
               case "sharpening":
                   if(state){
                       __listenValue();
                   }
                   break;
               case "light":
                   if(state){
                       __listenValue();
                   }
                   break;
               case "associatedDisplay":
                   //mapControl.mapLinkMove({
                   //    eventName:"onclick",
                   //    args:[mapLinkMove]
                   //});
                   if(state == true){
                       isLink = true;
                       //smallMap.moveMap(checkTemp);
                       smallMap.moveMap(checkAllTemp);
                       smallMap.checkAll(checkAllTemp);
                   }else{
                       isLink = false;
                       //smallMap.unMoveMap(checkTemp);
                       smallMap.unMoveMap(checkAllTemp);
                       smallMap.unCheckAll(checkAllTemp);
                   }
                   break;
               case "checkAll":
                   //mapControl.mapLinkMove({
                   //    eventName:"onclick",
                   //    args:[mapLinkMove]
                   //});
                   if(state == true){
                       isLink = true;
                       smallMap.moveMap(checkAllTemp);
                       smallMap.checkAll(checkAllTemp);
                   }else{
                       isLink = false;
                       smallMap.unMoveMap(checkAllTemp);
                       smallMap.unCheckAll(checkAllTemp);
                   }
                   break;
           }
        });
        //统一弹出框wrap
        //拖拽函数
        var drapableObj = function(obj){
            obj.on("mousedown","#popBox_title",function(event){
                event.stopPropagation();
                /* 获取需要拖动节点的坐标 */
                var offset_x = $(this).parent()[0].offsetLeft;//x坐标
                var offset_y = $(this).parent()[0].offsetTop;//y坐标
                /* 获取当前鼠标的坐标 */
                var mouse_x = event.pageX;
                var mouse_y = event.pageY;
                /* 绑定拖动事件 */
                /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
                $(document).on("mousemove",function(ev){
                    ev.stopPropagation();
                    /* 计算鼠标移动了的位置 */
                    var _x = ev.pageX - mouse_x;
                    var _y = ev.pageY - mouse_y;
                    /* 设置移动后的元素坐标 */
                    var now_x = parseFloat(offset_x + _x ) ;
                    var now_y = parseFloat(offset_y + _y );
                    //if(now_x<0&&now_y>=0){
                    //    obj.css({
                    //        top:0 + "px",
                    //        left:now_x + "px"
                    //    })
                    //}else{
                    //    obj.css({
                    //        top:now_y + "px",
                    //        left:now_x + "px"
                    //    })
                    //}
                    var popBox_minheight=parseFloat($("#popBox").height())/2;
                    var popBox_minwidth=parseFloat($("#popBox").width())/2;
                    var popBox_maxheight=parseFloat($("body").height())-popBox_minheight;

                    var popBox_maxwidth=parseFloat($("body").width())-popBox_minwidth;
                    console.log($(document).width());
                    if(now_x>popBox_maxwidth){
                        obj.css({
                            left:popBox_maxwidth + "px"
                        })
                    }else if(now_x<popBox_minwidth){
                        obj.css({
                            left:popBox_minwidth + "px"
                        })
                    }else{
                        obj.css({
                            left:now_x + "px"
                        })
                    }
                    if(now_y>popBox_maxheight){
                        obj.css({
                            top:popBox_maxheight + "px"
                        })
                    }else if(now_y<popBox_minheight){
                        obj.css({
                            top:popBox_minheight + "px"
                        })
                    }else{
                        obj.css({
                            top:now_y + "px"
                        })
                    }
                });
            });
            /* 当鼠标左键松开，接触事件绑定 */
            $(document).on("mouseup",function(event){
                event.stopPropagation();
                $(this).off("mousemove");
            });
        };
        var $popBox = $("#popBox");
        drapableObj($popBox);                               //弹出层可以拖拽
        tree.initTree();
        var taskData = tree.getTaskData();


        //监听点列表右键事件
        var dPid;
        grid_3.attachEvent("onRightClick", function(id,ind,obj){
            dPid = id;
            var $pointIdPop = $("#deletepointIdPop");
            $pointIdPop.css({"display":"block"}).fadeIn(500);    //透明蒙层，用于只能操作删除弹出层
            $("#deleteContainer").addClass("popContainer").fadeIn(500); // 显示删除弹出层
            drapableObj($pointIdPop);                               //弹出层可以拖拽
            $(".deletePointPopClose").on('click',function(){     //删除弹出层
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#deleteContainer").removeClass("popContainer").fadeOut(500);
            });
            $("#changeDelete").on('click',function(){     //删除弹出层
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#deleteContainer").removeClass("popContainer").fadeOut(500);
            });
            $("#commitDelete").on('click',function(){     //删除弹出层
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#deleteContainer").removeClass("popContainer").fadeOut(500);
                if(undefined != grid_3.getSelectedRowId()){
                    var pointArr = grid_3.getSelectedRowId().split(",");
                    pointArr.forEach(function(item){
                        var pointId = grid_3.cells(item, 1).getValue();
                        mapControl.deletePoint(grid_3,pointId);
                    })
                }else{
                    var pointId = grid_3.cells(dPid, 1).getValue();
                    mapControl.deletePoint(grid_3,pointId);
                }

            });
        });

        //监听影像右键事件
        var dyPid;
        grid_2.attachEvent("onRightClick", function(id,ind,obj){
            _removeState();
            dyPid = id;
            var $pointIdPop = $("#deletepointIdPop");
            $pointIdPop.css({"display":"block"}).fadeIn(500);    //透明蒙层，用于只能操作删除弹出层
            $("#deleteContainer").addClass("popContainer").fadeIn(500); // 显示删除弹出层
            drapableObj($pointIdPop);                               //弹出层可以拖拽
            $(".deletePointPopClose").on('click',function(){     //删除弹出层
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#deleteContainer").removeClass("popContainer").fadeOut(500);
            });
            $("#changeDelete").on('click',function(){     //删除弹出层
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#deleteContainer").removeClass("popContainer").fadeOut(500);
            });
            $("#commitDelete").on('click',function(){     //删除弹出层
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#deleteContainer").removeClass("popContainer").fadeOut(500);
                if(undefined != grid_2.getSelectedRowId()){
                    var pointArr = grid_2.getSelectedRowId().split(",");
                    pointArr.forEach(function(item){
                        var pId = grid_2.cells(item, 0).getValue();
                        smallMap.deletePoint(grid_2,pId,mapId,grid3Detail[pointId],_returnRemovePoint);
                    })
                }else{
                    var pId = grid_2.cells(dyPid, 0).getValue();
                    smallMap.deletePoint(grid_2,pId,mapId,grid3Detail[pointId],_returnRemovePoint);
                }

            });
        });
        //监听点列表,并编辑后保存至全局
        grid_3.attachEvent("onEditCell",function(stage,rowId,cellIndex,newValue,oldValue){
            _removeState();
            if ((stage==2)&&(newValue!=oldValue)){
                //alert("Cell with id="+rowId+" and index="+cellIndex+" was edited");
                dataMain.data.forEach(function(item){
                    if(item.pointid==rowId){
                        if(cellIndex==2){
                            item.pointtype=grid_3.cells(rowId, cellIndex).getValue();
                        }else if(cellIndex==4){
                            item.active=grid_3.cells(rowId, cellIndex).getValue();
                            //console.log(dataMain.data[index].active);
                        }else if(cellIndex==5){
                            item.lon=grid_3.cells(rowId, cellIndex).getValue();
                            mapControl.editListPoint(grid_3.cells(rowId, 5).getValue(),grid_3.cells(rowId, 6).getValue(),grid_3.cells(rowId, 1).getValue())
                        }else if(cellIndex==6){
                            item.lat=grid_3.cells(rowId, cellIndex).getValue();
                            mapControl.editListPoint(grid_3.cells(rowId, 5).getValue(),grid_3.cells(rowId, 6).getValue(),grid_3.cells(rowId, 1).getValue())
                        }else if(cellIndex==7){
                            item.height=grid_3.cells(rowId, cellIndex).getValue();
                        }
                    }

                });
                return true;
            }
            //console.log(dataMain);
            return true;
        });
        //监听影像列表,并编辑后保存至全局
        grid_2.attachEvent("onEditCell",function(stage,rowId,cellIndex,newValue,oldValue){
            if ((stage==2)&&(newValue!=oldValue)){
                //alert("Cell with id="+rowId+" and index="+cellIndex+" was edited");
                dataMain.data.forEach(function(item){
                    if(item.uuid==rowId){
                        if(cellIndex==5){
                            item.active=grid_2.cells(rowId, cellIndex).getValue();
                            console.log(item.active);
                        }else if(cellIndex==6){
                            item.x=grid_2.cells(rowId, cellIndex).getValue();
                        }else if(cellIndex==7){
                            item.y=grid_2.cells(rowId, cellIndex).getValue();
                        }
                    }

                });
                if(cellIndex == 6 || cellIndex == 7){
                    smallMap.editListPoint(grid_2.cells(rowId, 6).getValue(),grid_2.cells(rowId, 7).getValue(),grid_2.cells(rowId, 0).getValue(),mapId)
                }
                return true;
            }
            console.log(dataMain);
            return true;
        });




    };
    return {
        test:_test
    };
});