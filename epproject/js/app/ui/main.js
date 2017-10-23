/**
 * Created by domea on 17-6-2.
 */
define(['jquery','dhtmlx','ol','../gis/mapControls','../gis/smallMap'],function ($,dhtmlx,ol,mapControl,smallMap) {
    var _test=function(){
        window.restUrl;
        //默认第一个map
        var mapId = "div0";
        //联动保存选中项mapId
        var checkTemp = {};
        //是否选中联动按钮
        var isLink = false;
        //添加编辑后零时保存点
        var pointTemp;
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
                    {id : "imageRange", text : "影像范围", type : "checkbox"},
                    {id : "imageControl", text : "影像", type : "checkbox"},
                    {id : "controlPoint", text : "控制点", type : "checkbox"},
                    {id : "linkPoint", text : "连接点", type : "checkbox"},
                    {id : "checkPoint", text : "检查点", type : "checkbox"},
                    {id : "pointID", text : "点ID", type : "checkbox"}
                ]},
                {id : "tools", text : "工具", text_pos : "buttom", type : "block", mode : "cols", list : [
                    {id : "zoomIn", text : "放大",img:"big.png",isbig : true, type : "button"},
                    {id : "zoomOut", text : "缩小",img:"small.png",isbig : true, type : "button"},
                    {id : "translate", text : "平移",img : "move.png", isbig : true, type : "button"},
                    {id : "fullView", text : "全图",img:"allimage.png",isbig : true, type : "button"},
                    {id : "oneRatioOne", text : "1:1显示", img : "1show.png", isbig : true, type : "button"},
                    {id : "group_1", text : "group_1", type : "group", list : [
                        {id : "contrast", text : "对比度", type : "text"},
                        {id : "hue", text : "", type : "slider",  size : 100, min : -180, max : 180,value:0, step : 1, margin : 10}
                    ]},
                    {id : "group_2", text : "group_2", type : "group", list : [

                        {id : "sharpening", text : "锐&nbsp&nbsp&nbsp化", type : "text"},
                        {id : "chroma", text : "", type : "slider", size : 100, min : 0, max : 100,value:100, step : 1, margin : 10}
                    ]},
                    {id : "group_3", text : "group_2", type : "group", list : [

                        {id : "light", text : "亮&nbsp&nbsp&nbsp度", type : "text"},
                        {id : "lightness", text : "", type : "slider", size : 100, min : 0, max : 100,value:100, step : 1, margin : 10}
                    ]}

                ]},
                {id : "edit", text : "编辑", text_pos : "buttom", type : "block", mode : "cols", list : [

                    {id : "addPoint", text : "添加点",img:"plus_point.png", isbig : true, type : "button"},
                    {id : "stabPoint", text : "刺点",img:"hit_point.png", isbig : true, type : "button"},
                    {id : "modifyPoint", text : "修改点",img:"change_point.png", isbig : true, type : "button"},
                    {id : "deleteSingle", text : "删除点",img:"delete_point.png",isbig : true, type : "button"},
                    {id : "deleteAll", text : "删除所有点", img:"delete_all_point.png",isbig : true,type : "button"},
                    //{id : "delete", text : "删除",img:"删除点48px.png", isbig : true, type : "buttonSelect", items : [
                    //    {type : "item", buttonid : "deleteSingle",img:"删除点22px.png", text : "删除点"},
                    //    {type : "item", buttonid : "deleteAll",img:"删除所有点22px.png", text : "删除所有点"}
                    //]},
                    {id : "autoPrediction", text : "自动预测",img:"auto.png",isbig : true, type : "button"},
                    {id : "associatedDisplay", text : "关联显示",img:"view_connect.png",isbig : true, type : "button"}

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
            '<span class="delete">&times;</span>'+
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
        grid_3.setHeader(["","序号","点ID","点类型","重叠度","有效","经度","纬度","高程"]);
        grid_3.setColTypes("ro,ro,ro,ro,ro,edtxt,edtxt,edtxt,edtxt");

        grid_3.setColSorting('str,str,str,str,str,str,str,str,str');
        grid_3.setInitWidths('0,*,*,*,*,*,*,*,*');
        grid_3.init();
        grid_3.load('./data/grid.xml','xml');

      //存储每个创建的小地图，用于地图联动
       var mapLinkMove = [];
       //创建小地图
        var creatDiv = function(){
            $(".idMapContainer").empty();   //小地图地图容器每次创建前将前一次的小地图清空
            $(".idMapContainer").append('<div id="mapArr" style="height: 325px;cursor:crosshair;"></div>');
            //document.getElementById("mapArr").innerHTML = '';
            mapLinkMove = [];
            var mapCount = parseInt(arr[0].mapCount);
            for(var i=0;i<mapCount;i++){
                //var smallMap =  mapControl.createSmallMap("ol-mouse-position","tabContent"+i);  // 调用地图，第一个参数，鼠标移动控件挂载点，第二个参数：地图控件挂载点
                //mapLinkMove.push(smallMap);
                    var url = "";//urlArr[i];
                    var oDiv = document.createElement('div');
                    var checkDiv = document.createElement('div');
                    //checkDiv.style.height = "6%";
                    checkDiv.style.zIndex = "100";
                    checkDiv.style.position = "absolute";
                    checkDiv.style.marginLeft= "18%";
                    checkDiv.innerHTML = '<input type="checkbox" style="float: right;" name="div'+i+'" type="checkbox">';
                    checkDiv.onclick = function(event){
                        if(event.toElement.checked == true){
                            event.toElement.name;
                            checkTemp[event.toElement.name] = event.toElement.name;
                            //如果联动为选中状态，新选择地图增加联动监听
                            if(isLink == true){
                                smallMap.moveMap(checkTemp);
                            }
                        }else{
                            checkTemp[event.toElement.name] = "";
                            //如果联动为选中状态，取消地图选择移除取消的地图监听并重新增加监听
                            if(isLink == true) {
                                smallMap.unMoveMap(checkTemp);
                                smallMap.moveMap(checkTemp);
                            }
                        }
                    }

                    oDiv.appendChild(checkDiv);
                    oDiv.style.height = "299px";
                    oDiv.style.width = "19.7%";
                    oDiv.style.float = "left";
                    oDiv.style.marginLeft = "0.3%";
                    oDiv.id = "div"+i;

                    if(oDiv.id == "div0"){
                        oDiv.style.border = "1px red solid";
                    }else{
                        oDiv.style.border = "1px #989696 solid";
                    }
                    oDiv.onclick = function(event){
                        mapId = event.currentTarget.id;
                        document.getElementById(mapId).style.border = "1px red solid";
                        for(var i=0;i<mapCount;i++){
                            if(mapId != "div"+i){
                                document.getElementById("div"+i).style.border = "1px #989696 solid";
                            }
                        }
                    }

                    document.getElementById("mapArr").appendChild(oDiv);
                    var wmtsUrl = "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/";
                    var url = "http://192.168.31.12:8888/geoserver/wm/wms";
                var mapTemp = smallMap.createMap(wmtsUrl,url,oDiv.id );
            }
            i=null;
        };

        var mapCount;
        var arr = [];
        // 每次单击一行，取得那一行的信息
        grid_3.attachEvent('onRowSelect', function(rId, cInd){
            var obj = {};
            obj.id = rId;   //行ID
            obj.mapCount =  grid_3.cells(rId,3).getValue();  //取得重叠度
            if(!arr[0]){      // 第一次选择一行
                arr.push(obj);
            }else{     //判断选择的这一行是否已经存在了
                if(parseInt(arr[0].id) === parseInt(obj.id)){
                   return arr;
                }else{
                    arr.pop(arr[0]);
                    arr.push(obj);
                }
            }
            $(".tabLi").css({"display":"block"});   //选择一行，显示其对应的选项卡
            $('.idName').html(rId);              // 将选择的那一行显示到选项卡
            creatDiv();       //创建每副小地图容器，并且调用地图
            return arr;
        });

        var status_1 = layout_1.attachStatusBar();
        //主视图鼠标移动显示经纬度控件挂载点
        status_1.setText('<div id="post11"><div class="ol-mouse-position2"></div></div>');
        $("#post11").css({
            "position": "relative",
            "top": "0",
            "left": "80%",
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
        grid_2.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");

        grid_2.setColSorting('str,str,str,str,str,str,str,str');
        grid_2.setInitWidths('0,*,*,*,*,*,*,*');
        grid_2.init();
        grid_2.load('./data/grid.xml','xml');

        //接收添加的点
        var _returnAddPoint = function(point){
            pointTemp = point;
        }
        //接收编辑的点
        var _returnEditPoint = function(point){
            pointTemp = point;
        }
        //接收选中的点
        var _returnSelectLint = function(points){
            points;
        }
        //接收删除的点
        var _returnRemovePoint = function(points){
            points;
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
        //监听菜单是否点击了
        ribbon_1.attachEvent("onClick", function(id) {
            switch(id){
                case "open":
                   console.log(id);
                    break;
                case "close":
                    console.log(id);
                    break;
                case "export":
                    mapControl.export({
                        eventName:"onClick"
                    });
                    break;
                case "zoomIn":
                    $("#mapMainContainer").css({"cursor":"crosshair"});
                    mapControl.zoomIn({
                         eventName:"onClick",
                         arg: []
                     });
                    break;
                case "zoomOut":
                    $("#mapMainContainer").css({"cursor":"crosshair"});
                    mapControl.zoomOut({
                        eventName:"onClick"
                      //  arg: [id,"mapMainContainer"]
                    });
                    break;
                case "fullView":
                    mapControl.fullView({
                        eventName:"onClick"
                        //arg: [id,mapId]
                    });
                    break;
                case "translate":
                    $(".mapMainContainer").css({"cursor":"move"});
                    mapControl.translate({
                        eventName:"onClick"
                        //arg: [id,mapId]
                    });
                    break;
                case "oneRatioOne":
                    mapControl.oneRatioOne({
                        eventName:"onClick"
                        //arg: [id,mapId]
                    });
                    break;
                case "addPoint":
                    if($mainViewFlag == true){
                        $(".mapMainContainer").css({"cursor":"default"});
                        mapControl.addPoint({
                            eventName:"onClick",
                            arg: [grid_3]
                        });
                    }

                    break;
                case "stabPoint":
                    if($mainViewFlag == true) {
                        $(".mapMainContainer").css({"cursor": "crosshair"});
                        // $(".mapMainContainer").css({"cursor":"default"});
                        mapControl.stabPoint({
                            eventName: "onClick",
                            arg: [grid_3]
                        });
                    }else{
                        $("."+mapId).css({"cursor": "crosshair"});
                        smallMap.addPoint({
                            eventNme: "onClick",
                            arg: [id,grid_2,mapId,_returnAddPoint]
                        });
                    }
                    break;
                case "modifyPoint":
                    if($mainViewFlag == true) {
                        $(".mapMainContainer").css({"cursor": "pointer"});
                        mapControl.modifyPoint({
                            eventName: "onClick"
                            //arg: [id,mapId]
                        });
                    }else{
                        smallMap.editPoint({
                            eventNme: "onClick",
                            arg: [id,grid_2,mapId,_returnEditPoint]
                        });
                    }
                    break;
                case "deleteSingle":
                    mapControl.deleteSinglePoint({
                        eventName:"onClick"
                    });
                    break;
                case "deleteAll":
                    mapControl.deleteAllPoint({
                        eventName:"onClick"
                    });
                    break;
                case "autoPrediction":
                    $(".autoMatch").addClass("autoMatchLoading").fadeIn(500);
                    //这里写的只是测试加载动画，真实情况要从后台处理数据进度判断动画消失的时间
                    setTimeout(function(){
                        $(".autoMatch").removeClass('.autoMatchLoading').fadeOut(500);
                    },10000);
                    break;
                case "associatedDisplay":
                    mapControl.mapLinkMove({
                        eventName:"onclick",
                        args:[mapLinkMove]
                    });
                    break;
                case "autoMatch":
                    $(".autoMatch").addClass("autoMatchLoading").fadeIn(500);
                    //这里写的只是测试加载动画，真实情况要从后台处理数据进度判断动画消失的时间
                    setTimeout(function(){
                        $(".autoMatch").removeClass('.autoMatchLoading').fadeOut(500);
                    },10000);

                    break;
                case "blockAdjustment":
                    console.log(id);
                    break;
            }
        });

        ribbon_1.attachEvent('onCheck', function(id, state){
           switch(id){
               case "imageRange":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "imageControl":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "controlPoint":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "linkPoint":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "checkPoint":
                   if(state){
                       console.log("你选中了" + id);
                   }else{
                       console.log("你取消了选择" + id);
                   }
                   break;
               case "pointID":
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
           }
        });
    };
    return {
        test:_test
    };
});