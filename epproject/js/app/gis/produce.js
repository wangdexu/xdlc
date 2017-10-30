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
        var newdata=[];
        var judgedata=[];
        var dataArr = dataMain.TiePoint.Property;
        var shu=dataArr.length;
        for(var i=0;i<shu;i++){
            var degree=0;
            var id;
            var judge=judgedata.indexOf(dataArr[i].pointid);
            //console.log(judge);
            //console.log(judgedata);
            if(judge!=-1) {
                ++i;
                //console.log(i-1);
            }else{
            //console.log(i);
            for(var j=i;j<shu;j++) {

                if (dataArr[i].pointid == dataArr[j].pointid){
                    //console.log(i,j);
                    ++degree;
                    id=dataArr[i].pointid;
                    //console.log(degree);
                }
                    }
                judgedata.push(id);
                //console.log(id,degree);
                newdata.push({"id":id,"degree":degree});
            }
        }
        pointNumber(dataMain,newdata);
        function pointNumber(dataMain,newdata){
            //生成点信息数据
            var data= {
                rows: []
            };
            var shu=newdata.length;
            for(var i=1;i<=shu;i++){
                data.rows.push({ id:newdata[i-1].id, data: [i,newdata[i-1].id,"TiePoint",newdata[i-1].degree,"1","","",""]});
            }
            console.log(data);
            argList.arg[0].clearAll();
            //console.log(data);
            argList.arg[0].parse(data,function(){
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
        var $popBox = $("#popBox");
        $popBox.fadeIn(500);    //透明蒙层
        $("#popBox").on('click',"#popBox_close,#totall_close",function(){     //删除弹出层
            $popBox.fadeOut(500);
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

