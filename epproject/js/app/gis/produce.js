define(['jquery','dhtmlx','ol'],function($,dhl,ol){
    var _autoMatch = function(argList){
        var dataMain={
            "Systemproperty" :
            {
                "Freeze" :
                [
                    {
                        "name" : "FreezeExecute",
                        "title" : "冻结执行",
                        "type" : "string",
                        "value" : ""
                    }
                ],
                    "SystemConfiguration" :
                [
                    {
                        "name" : "ThreadNum",
                        "title" : "线程个数",
                        "type" : "int",
                        "value" : 0
                    },
                    {
                        "name" : "BlockSize",
                        "title" : "分块大小",
                        "type" : "int",
                        "value" : null
                    }
                ]
            },
            "Userproperty" :
            {
                "InputParameter" :
                {
                    "Configuration" : [],
                    "InputFilePath" :
                    [
                        {
                            "auto" : [ "" ],
                            "name" : "GeoCoordinate",
                            "title" : "物方坐标",
                            "type" : "double",
                            "value" : [ 117.196185, 39.475796000000003, -0.94199999999999995 ]
                        },
                        {
                            "auto" : [ "ZY3", "TH" ],
                            "index" : 0,
                            "multi" : true,
                            "name" : "InputImgFileName",
                            "title" : "输入影像",
                            "type" : "string",
                            "value" : "/mnt/hgfs/Data/tianjin-2/JB12-1_CCD_000252393_STE01_001_001_L1-01.tiff"
                        },
                        {
                            "auto" : [ "ZY3", "TH" ],
                            "index" : 1,
                            "multi" : true,
                            "name" : "InputImgFileName",
                            "title" : "输入影像",
                            "type" : "string",
                            "value" : "/mnt/hgfs/Data/tianjin-2/JB12-1_CCD_000252393_STE01_001_001_L1-02.tiff"
                        },
                        {
                            "auto" : [ "ZY3", "TH" ],
                            "index" : 2,
                            "multi" : true,
                            "name" : "InputImgFileName",
                            "title" : "输入影像",
                            "type" : "string",
                            "value" : "/mnt/hgfs/Data/tianjin-2/JB12-1_CCD_000252393_STE01_001_001_L1-03.tiff"
                        },
                        {
                            "auto" : [ "dir_pan", "pan2", "PAN" ],
                            "index" : 0,
                            "multi" : true,
                            "name" : "InputRPCFileName",
                            "title" : "输入RPC",
                            "type" : "url",
                            "value" : "/mnt/hgfs/Data/tianjin-2/JB12-1_CCD_000252393_STE01_001_001_L1-01.rpb"
                        },
                        {
                            "auto" : [ "dir_pan", "pan2", "PAN" ],
                            "index" : 1,
                            "multi" : true,
                            "name" : "InputRPCFileName",
                            "title" : "输入RPC",
                            "type" : "url",
                            "value" : "/mnt/hgfs/Data/tianjin-2/JB12-1_CCD_000252393_STE01_001_001_L1-02.rpb"
                        },
                        {
                            "auto" : [ "dir_pan", "pan2", "PAN" ],
                            "index" : 2,
                            "multi" : true,
                            "name" : "InputRPCFileName",
                            "title" : "输入RPC",
                            "type" : "url",
                            "value" : "/mnt/hgfs/Data/tianjin-2/JB12-1_CCD_000252393_STE01_001_001_L1-03.rpb"
                        },
                        {
                            "auto" : [ "dir_pan", "pan2", "PAN" ],
                            "index" : 0,
                            "multi" : true,
                            "name" : "InputImgGeo",
                            "title" : "影像地理范围",
                            "type" : "double",
                            "value" :
                                [
                                    117.1707172,
                                    39.714812219999999,
                                    117.3680691,
                                    39.689810369999996,
                                    116.99190590000001,
                                    39.08999103,
                                    117.18758750000001,
                                    39.065114889999997
                                ]
                        },
                        {
                            "auto" : [ "dir_pan", "pan2", "PAN" ],
                            "index" : 1,
                            "multi" : true,
                            "name" : "InputImgGeo",
                            "title" : "影像地理范围",
                            "type" : "double",
                            "value" :
                                [
                                    117.1786493,
                                    39.70355137,
                                    117.35349069999999,
                                    39.672814119999998,
                                    117.0039977,
                                    39.100940710000003,
                                    117.1774279,
                                    39.070319910000002
                                ]
                        },
                        {
                            "auto" : [ "dir_pan", "pan2", "PAN" ],
                            "index" : 2,
                            "multi" : true,
                            "name" : "InputImgGeo",
                            "title" : "影像地理范围",
                            "type" : "double",
                            "value" :
                                [
                                    117.16906040000001,
                                    39.702466600000001,
                                    117.35907280000001,
                                    39.659470040000002,
                                    117.000249,
                                    39.124786929999999,
                                    117.1887974,
                                    39.08190072
                                ]
                        }
                    ]
                },
                "OutputParameter" :
                {
                    "OutPutFilePath" :
                    [
                        {
                            "att" :
                                [
                                    {
                                        "name" : "DataFormat",
                                        "title" : "影像格式",
                                        "type" : "string",
                                        "value" : ""
                                    },
                                    {
                                        "name" : "ImageTime",
                                        "title" : "生产时间",
                                        "type" : "number",
                                        "value" : 1508726704784
                                    },
                                    {
                                        "name" : "MapProjection",
                                        "title" : "投影类型",
                                        "type" : "string",
                                        "value" : ""
                                    },
                                    {
                                        "name" : "EarthModel",
                                        "title" : "参考椭球",
                                        "type" : "string",
                                        "value" : ""
                                    },
                                    {
                                        "name" : "PixelSpacing",
                                        "title" : "分辨率",
                                        "type" : "number",
                                        "value" : ""
                                    },
                                    {
                                        "name" : "SatelliteID",
                                        "title" : "卫星标识",
                                        "type" : "string",
                                        "value" : ""
                                    },
                                    {
                                        "name" : "Location",
                                        "title" : "地理位置",
                                        "type" : "number",
                                        "value" : ""
                                    },
                                    {
                                        "name" : "DataType",
                                        "title" : "Data类型",
                                        "type" : "string",
                                        "value" : ""
                                    }
                                ],
                            "xy" :
                                [
                                    {
                                        "index" : 0,
                                        "multi" : "true",
                                        "name" : "ImgCoordinate",
                                        "suffix" : "",
                                        "title" : "像方坐标",
                                        "type" : "double",
                                        "value" : [ 10774.369829352097, 31598.402745536827 ]
                                    },
                                    {
                                        "index" : 1,
                                        "multi" : "true",
                                        "name" : "ImgCoordinate",
                                        "suffix" : "",
                                        "title" : "像方坐标",
                                        "type" : "double",
                                        "value" : [ 10677.25186769914, 37162.398384846216 ]
                                    },
                                    {
                                        "index" : 2,
                                        "multi" : "true",
                                        "name" : "ImgCoordinate",
                                        "suffix" : "",
                                        "title" : "像方坐标",
                                        "type" : "double",
                                        "value" : [ 10825.370724215207, 29241.449871842775 ]
                                    }
                                ]
                        }
                    ],
                        "ProgramStatus" :
                    [
                        {
                            "name" : "ReturnCode",
                            "title" : "运行状态",
                            "type" : "int",
                            "value" : 0
                        },
                        {
                            "name" : "ReturnAnalyse",
                            "title" : "错误描述",
                            "type" : "string",
                            "value" : "Image coordinates predict succeed!"
                        }
                    ],
                        "tempfile" : []
                }
            },
            "dirs" : [ "原始RPC" ],
            "name" : "像点预测",
            "op" : "ImgPoiPredict",
            "outputDir" : "",
            "tmp" : "tmp",
            "version" : "0.0.1",
            "workDir" : ""
        }



        console.log("1");
    };
    var _blockAdjustment = function(argList){
        console.log("2");
    };

    return {
        autoMatch:_autoMatch,
        blockAdjustment:_blockAdjustment
    }
});

