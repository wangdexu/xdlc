define(['jquery','dhtmlx','ol'],function($,dhl,ol){
    var _autoMatch = function(argList){
        //"点列表""影像列表",虚拟数据
        var dataMain={
            "TiePoint" :
            {
                "Property" :
                    [
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_1_10_883_123.tif",
                            "imageid":	"F_1",
                            "pointid" : 1,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 6,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_125.tif",
                            "imageid":	"N_1",
                            "pointid" : 1,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_1_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 2,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 2,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 2,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 4,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 2,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 2,
                            "x" : 44.1632,
                            "y" : 319.1258
                        },
                        {
                            "imagename" : "E:\\testdata\\inputData\\TH\\TH01-01_R201202210000003_1A_SXZ_2_10_883_126.tif",
                            "imageid":	"F_1",
                            "pointid" : 4,
                            "x" : 44.1632,
                            "y" : 319.1258
                        }
                    ]
            }
        };
        var imageData={};                           //影像列表显示的data数据
        var newdata=[];                             //点列表显示的data数据
        var judgedata=[];                           //存一个遍历过的id集合,用于后面的判断
        var dataArr = dataMain.TiePoint.Property;
        var shu=dataArr.length;
        for(var i=0;i<shu;i++){                        //一级遍历
            var degree=0;                               //重叠度数
            var id;                                     //点id
            var judge=judgedata.indexOf(dataArr[i].pointid);        //判断参数
            //console.log(judge);
            //console.log(judgedata);
            if(judge!=-1) {                                         //判断之前是否有同样的id,有就跨过,执行下一轮
                //console.log(i-1);
            }else{
            //console.log(i);
                var keydata={"rows":[]};                            //影像列表data的组成部分
                var k=0;                                            //只是给影像列表加一个连续的数字序号
            for(var j=i;j<shu;j++) {                                //二级遍历
                if (dataArr[i].pointid == dataArr[j].pointid){      //判断后面是否有同样的id
                    //console.log(j);
                    ++degree;
                    id=dataArr[i].pointid;
                    //console.log(degree);
                    k++;
                    keydata.rows.push({"id":k,"data":["aaa",k,dataArr[i].pointid,dataArr[i].imageid,dataArr[i].imagename,"1",dataArr[i].x,dataArr[i].y]});
                }
                    }
                //imageData.push({"key":id,"data":keydata});
                //imageData.dataid.push(keydata);
                //console.log(id);
                imageData[id]=keydata;         //关键一步,用动态生成的id作为key
                //{"3":{"rows": [{"id":1,"data":["aaa","1","3","img0","2","1","13907.669428881965","13147.054622607193","http://192.168.4.2:18080/geowebcache/service/wms?VERSION:1.1.1&layers=GF2_PMS1_E113.6_N40.1_20160308_L1A0001458090-PAN1_20171020"]},
                //    {"id":2,"data":["bbb","2","3","img1","2","1","20549.190592890045","17841.913952814564","http://192.168.4.2:18080/geowebcache/service/wms?VERSION:1.1.1&layers=GF2_PMS1_E113.6_N40.1_20160308_L1A0001458090-PAN1_20171020"]},
                //    {"id":3,"data":["ccc","3","3","img2","2","1","5898.776260519281","21325.1966816781","http://192.168.4.2:18080/geowebcache/service/wms?VERSION:1.1.1&layers=GF2_PMS1_E113.6_N40.1_20160308_L1A0001458090-PAN1_20171020"]}]}}

                //console.log(j);
                judgedata.push(id);          //存一个遍历过的id集合,用于后面的判断
                //imageData.push{id:{"rows":[]}}
                //console.log(imageData);
                newdata.push({"id":id,"degree":degree});
            }
        }
        //console.log(imageData);
        //点列表
        pointList(dataMain,newdata);                //调用点列表显示函数
        function pointList(dataMain,newdata){       //点列表显示函数
            //生成点信息数据
            var data= {
                rows: []
            };
            var shu=newdata.length;
            for(var i=1;i<=shu;i++){
                data.rows.push({ id:newdata[i-1].id, data: [i,newdata[i-1].id,"TiePoint",newdata[i-1].degree,"1","","",""]});  //动态生成点列表的data数据
            }
            argList.arg[0].clearAll();     //显示前先清空表格
            //console.log(data);
            argList.arg[0].parse(data,function(){    //将数据加载到表格
                //alert(1);
            },"json");
        }
        //影像列表
        imageList(argList.arg[0].getRowId(0),imageData);  //默认显示点列表第一行的数据到影像列表

        argList.arg[0].attachEvent('onRowSelect', function(rId, cInd){
            imageList(rId,imageData);                       //点击调用影像列表显示函数
        });
        function imageList(rId,imageData) {            //影像列表显示函数
            var data=imageData[rId];
            console.log(data);
            argList.arg[1].clearAll();
            //console.log(data);
            argList.arg[1].parse(data,function(){
                //alert(1);
            },"json");
        }
    };
    var _blockAdjustment = function(){
        //"总结"弹出框
        $("#popBox_wrap").css({width:"auto",height:"auto"});
        $("#popBox_bottom").empty();
        $("#popBox_wrap").empty();
        $("#popBox_wrap").load('./data/totall.html',function(){
            totallInformation(dataMain);
        });
        //var $popBox = $("#popBox");
        //$popBox.fadeIn(500);    //显示弹出层
        $("#popCase").addClass("popContainer").fadeIn(500); //显示透明蒙层
        $("#popBox").on('click',"#popBox_close,#totall_close",function(){     //删除弹出层
            //$popBox.fadeOut(500);
            $("#popCase").addClass("popContainer").fadeOut(500); //删除透明蒙层
        });
        //"点数"弹出框,虚拟数据
        var pointData={
            "Review":
            [
                {
                    "ImgID" : "F_1",
                    "PointID": 2,
                    "Imgx" : 3810.500,
                    "Imgy" : 4943.500,
                    "detImgx" : -1.249,
                    "detImgy" : 1.176,
                    "Rmse" : 1.716
                },
                {
                    "ImgID" : "F_1",
                    "PointID": 3,
                    "Imgx" : 3810.500,
                    "Imgy" : 4943.500,
                    "detImgx" : -1.249,
                    "detImgy" : 1.176,
                    "Rmse" : 1.716
                },
                {
                    "ImgID" : "F_1",
                    "PointID": 4,
                    "Imgx" : 3810.500,
                    "Imgy" : 4943.500,
                    "detImgx" : -1.249,
                    "detImgy" : 1.176,
                    "Rmse" : 1.716
                },
                {
                    "ImgID" : "F_1",
                    "PointID": 5,
                    "Imgx" : 3810.500,
                    "Imgy" : 4943.500,
                    "detImgx" : -1.249,
                    "detImgy" : 1.176,
                    "Rmse" : 1.716
                },
                {
                    "ImgID" : "F_1",
                    "PointID": 6,
                    "Imgx" : 3810.500,
                    "Imgy" : 4943.500,
                    "detImgx" : -1.249,
                    "detImgy" : 1.176,
                    "Rmse" : 1.716
                },
                {
                    "ImgID" : "F_1",
                    "PointID": 7,
                    "Imgx" : 3810.500,
                    "Imgy" : 4943.500,
                    "detImgx" : -1.249,
                    "detImgy" : 1.176,
                    "Rmse" : 1.716
                }
            ]
        };
        $("#popBox").on('click',"#totall_check",function(){     //删除弹出层
            $("#popBox_wrap").empty();
            pointNumber(pointData);
        });
        //"总结"弹出框,虚拟数据
        var dataMain={
            "RefineSum":
            [
                {
                    "name" : "TotalImageRMSE",
                    "Unit": "pixels",
                    "value" : 1.839
                },
            {
                "name" : "CheckPointRMSE",
                "GroundX" : 3.042,
                "GroundXSize" : 7,
                "GroundY" : 3.453,
                "GroundYSize" : 7,
                "GroundZ" : 8.026,
                "GroundZSize" : 7,
                "ImageX" : 1.234,
                "ImageXSize" : 20,
                "ImageY" : 1.436,
                "ImageYSize" : 20,
                "CE90" : 6.153,
                "LE90" : 9.131
            },
            {
                "name" : "ControlPointRMSE",
                "GroundX" : 0.000,
                "GroundXSize" : 0,
                "GroundY" : 0.000,
                "GroundYSize" : 0,
                "GroundZ" : 0.000,
                "GroundZSize" : 0,
                "ImageX" : 0.000,
                "ImageXSize" : 20,
                "ImageY" : 0.000,
                "ImageYSize" : 0,
                "CE90" : 0.000,
                "LE90" : 0.000
            }
        ]
        };
        totallInformation(dataMain);

            function totallInformation() {
                var dataTitle = dataMain.RefineSum;
                $("#totall_name").html(""+dataTitle[0].name);
                $("#totall_Unit").empty().html(dataTitle[0].Unit);
                $("#totall_value").empty().html(dataTitle[0].value);
                $("#control_name").empty().html(dataTitle[1].name);
                $("#control_GroundX").empty().html(dataTitle[1].GroundX+"("+dataTitle[1].GroundXSize+")");
                $("#control_GroundY").empty().html(dataTitle[1].GroundY+"("+dataTitle[1].GroundYSize+")");
                $("#control_GroundZ").empty().html(dataTitle[1].GroundZ+"("+dataTitle[1].GroundZSize+")");
                $("#control_ImageX").empty().html(dataTitle[1].ImageX+"("+dataTitle[1].ImageXSize+")");
                $("#control_ImageY").empty().html(dataTitle[1].ImageY+"("+dataTitle[1].ImageYSize+")");
                $("#control_CE90").empty().html(dataTitle[1].CE90);
                $("#control_LE90").empty().html(dataTitle[1].LE90);
                $("#check_name").empty().html(dataTitle[2].name);
                $("#check_GroundX").empty().html(dataTitle[2].GroundX+"("+dataTitle[2].GroundXSize+")");
                $("#check_GroundY").empty().html(dataTitle[2].GroundY+"("+dataTitle[2].GroundYSize+")");
                $("#check_GroundZ").empty().html(dataTitle[2].GroundZ+"("+dataTitle[2].GroundZSize+")");
                $("#check_ImageX").empty().html(dataTitle[2].ImageX+"("+dataTitle[2].ImageXSize+")");
                $("#check_ImageY").empty().html(dataTitle[2].ImageY+"("+dataTitle[2].ImageYSize+")");
                $("#check_CE90").empty().html(dataTitle[2].CE90);
                $("#check_LE90").empty().html(dataTitle[2].LE90);
            }
        //点号
        function pointNumber(pointData){
            $("#popBox_bottom").empty();
            $("#popBox_wrap").css({width:"900px",height:"400px"});
            window.dhx4.skin = 'material';
            var main_layout = new dhtmlXLayoutObject($("#popBox_wrap")[0], '1C');
            var a = main_layout.cells('a');
            a.setHeight('300');
            a.setWidth('600');
            a.hideHeader();
            var grid_4 = a.attachGrid();
            grid_4.setIconsPath('./codebase/imgs/');
            grid_4.setHeader(["行号","影像ID","点ID","有效","X","Y","RX","RY","残差"]);
            grid_4.setColTypes("ro,ro,ro,ro,edtxt,edtxt,edtxt,edtxt,edtxt");

            grid_4.setColSorting('str,str,str,str,str,str,str,str,str');
            grid_4.setInitWidths('*,*,*,*,*,*,*,*,*');
            grid_4.init();

            var dataArr = pointData.Review;
            //生成点信息数据
            var data= {
                rows: []
            };
            var shu=dataArr.length;
            for(var i=1;i<=shu;i++){
                data.rows.push({ id:dataArr[i-1].PointID, data: [i,dataArr[i-1].ImgID,dataArr[i-1].PointID,"有效",dataArr[i-1].Imgx,dataArr[i-1].Imgy,dataArr[i-1].detImgx,dataArr[i-1].detImgy,dataArr[i-1].Rmse]});
            }
            grid_4.clearAll();
            console.log(data);
            grid_4.parse(data,function(){
                //alert(1);
            },"json");

            $("#popBox_bottom").append('<div id="point_bottom"><button id="point_confirm">确定</button><button id="again_average">重新平差</button><div><span>残差阀值:</span><input id="average_switch" type="text"/></div><button id="point_delete">删除</button></div>');
            $("#point_bottom").css({width:"100%",height:"60px",padding:"10px 0"});
            $("#point_bottom>button").css({marginLeft:"100px",textAlign:"center",height:"40px",lineHeight:"40px"});
            $("#point_bottom>div").css({marginLeft:"100px",display:"inline-block",height:"40px",lineHeight:"40px"});
        }
    };

    return {
        autoMatch:_autoMatch,
        blockAdjustment:_blockAdjustment
    }
});

