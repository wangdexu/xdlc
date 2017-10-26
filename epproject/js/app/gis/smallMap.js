/**
 * Created by domea on 17-6-2.
 */
define(['./config','dhtmlx','ol'],function (config) {

    //创建地图
    var mapTemp = {};
    var rasterTemp = {};
    var controlIds;
    var controlId;
    var projection = ol.proj.get('EPSG:3857');
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(14);
    var matrixIds = new Array(14);
    for (var z = 0; z < 14; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }
    var _createMap = function(wmtsUrl,url,divId){
        /**
         * Color manipulation functions below are adapted from
         * https://github.com/d3/d3-color.
         */
        var Xn = 0.950470;
        var Yn = 1;
        var Zn = 1.088830;
        var t0 = 4 / 29;
        var t1 = 6 / 29;
        var t2 = 3 * t1 * t1;
        var t3 = t1 * t1 * t1;
        var twoPi = 2 * Math.PI;


        /**
         * Convert an RGB pixel into an HCL pixel.
         * @param {Array.<number>} pixel A pixel in RGB space.
         * @return {Array.<number>} A pixel in HCL space.
         */
        function rgb2hcl(pixel) {
            var red = rgb2xyz(pixel[0]);
            var green = rgb2xyz(pixel[1]);
            var blue = rgb2xyz(pixel[2]);

            var x = xyz2lab(
                (0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn);
            var y = xyz2lab(
                (0.2126729 * red + 0.7151522 * green + 0.0721750 * blue) / Yn);
            var z = xyz2lab(
                (0.0193339 * red + 0.1191920 * green + 0.9503041 * blue) / Zn);

            var l = 116 * y - 16;
            var a = 500 * (x - y);
            var b = 200 * (y - z);

            var c = Math.sqrt(a * a + b * b);
            var h = Math.atan2(b, a);
            if (h < 0) {
                h += twoPi;
            }

            pixel[0] = h;
            pixel[1] = c;
            pixel[2] = l;

            return pixel;
        }


        /**
         * Convert an HCL pixel into an RGB pixel.
         * @param {Array.<number>} pixel A pixel in HCL space.
         * @return {Array.<number>} A pixel in RGB space.
         */
        function hcl2rgb(pixel) {
            var h = pixel[0];
            var c = pixel[1];
            var l = pixel[2];

            var a = Math.cos(h) * c;
            var b = Math.sin(h) * c;

            var y = (l + 16) / 116;
            var x = isNaN(a) ? y : y + a / 500;
            var z = isNaN(b) ? y : y - b / 200;

            y = Yn * lab2xyz(y);
            x = Xn * lab2xyz(x);
            z = Zn * lab2xyz(z);

            pixel[0] = xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
            pixel[1] = xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
            pixel[2] = xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

            return pixel;
        }

        function xyz2lab(t) {
            return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
        }

        function lab2xyz(t) {
            return t > t1 ? t * t * t : t2 * (t - t0);
        }

        function rgb2xyz(x) {
            return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        }

        function xyz2rgb(x) {
            return 255 * (x <= 0.0031308 ?
                12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
        }
        var bing = new ol.source.BingMaps({
            key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here',
            imagerySet: 'Aerial'
        });
        var raster = new ol.source.Raster({
            sources: [
                new ol.source.OSM()
            ],
            operation: function(pixels, data) {
                var hcl = rgb2hcl(pixels[0]);

                var h = hcl[0] + Math.PI * data.hue / 180;
                if (h < 0) {
                    h += twoPi;
                } else if (h > twoPi) {
                    h -= twoPi;
                }
                hcl[0] = h;

                hcl[1] *= (data.chroma / 100);
                hcl[2] *= (data.lightness / 100);

                return hcl2rgb(hcl);
            },
            lib: {
                rgb2hcl: rgb2hcl,
                hcl2rgb: hcl2rgb,
                rgb2xyz: rgb2xyz,
                lab2xyz: lab2xyz,
                xyz2lab: xyz2lab,
                xyz2rgb: xyz2rgb,
                Xn: Xn,
                Yn: Yn,
                Zn: Zn,
                t0: t0,
                t1: t1,
                t2: t2,
                t3: t3,
                twoPi: twoPi
            }
        });

        var controls = {};

        raster.on('beforeoperations', function(event) {
            var data = event.data;
            for (var id in controlId) {
                data[id] = Number(controlId[id].value);
            }
        });

        var map = new ol.Map({
            layers: [
                new ol.layer.Image({
                    source: raster
                }),
                new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: url,
                        params:
                        {'LAYERS': 'wm:ImageMosic',
                            'FORMAT':'image/png',
                            'VERSION':'1.1.1',
                            SRS: 'EPSG:4326',
                            TRANSPARENT:false,QUERYTYPE:"phasetile",OPATICY:0.7//'TILED': true,
                        }
                    })
                })
            ],
            target: divId,
            view: new ol.View({
                projection:'EPSG:4326',
                //center: [11975542.09549514,4225234.686415287],
                center: [115.77942,40.00397],
                zoom: 9,
                maxZoom: 18
            }),
            controls: ol.control.defaults({
                attribution: false,
                rotate: false,
                zoom: false
            }).extend([
                //new ol.control.FullScreen(),
                new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(4),
                    projection: 'EPSG:4326',
                    //className: 'custom-mouse-position',
                    //target: document.getElementById('mouse-position')
                })
            ]),
            events: {
                map: ['singleclick','pointermove']
            }
        });
        mapTemp[divId] = map;
        rasterTemp[divId] = raster;
        controlId = {
            'hue':{'value':0},
            'chroma':{'value':100},
            'lightness':{'value':100}
        }
        controlIds = ['hue', 'chroma', 'lightness'];
        //controlIds.forEach(function(id) {
        //    var control = document.getElementById(id);
        //    var output = document.getElementById(id + 'Out');
        //    control.addEventListener('input', function() {
        //        output.innerText = control.value;
        //        raster.changed();
        //    });
        //    output.innerText = control.value;
        //    controls[id] = control;
        //});

        return mapTemp;
    }

    var olLingKey;
    //监听移动地图
    var _moveMap = function(data){
        for(id in data){
            if(data[id] != "" && data[id] != undefined){
                var map = mapTemp[id];
                olLingKey = map.on("moveend",function(){
                    for(m2 in mapTemp){
                        if(data[m2] != "" && data[m2] != undefined){
                            mapTemp[m2].setView(map.getView());
                        }
                    }
                });
            }
        }
    }

    //移除移动地图监听
    var _unMoveMap = function(data) {
        for (id in data) {
            if (data[id] != "" && data[id] != undefined) {
                //var map = mapTemp[id];
                mapTemp[id].un("moveend",olLingKey);
                mapTemp[id].removeEventListener("moveend",olLingKey);
                var view =  new ol.View({
                    projection:'EPSG:4326',
                    center: mapTemp[id].getView().getCenter(),
                    zoom: mapTemp[id].getView().getZoom(),
                    maxZoom: 18
                }) ;
                mapTemp[id].setView(view);
            }
        }
    }
    //全图操作
    var _fullView = function(data){
        var map = mapTemp[data.arg[1]];
        var view = new ol.View({
            center: [11975542.09549514,4225234.686415287],
            zoom: 3,
            maxZoom: 18
        })
        map.setView(view);
    }
    //放大
    var _toBig = function(data){
        var map = mapTemp[data.arg[1]];
        map.getView().getZoom();
        map.getView().setZoom(map.getView().getZoom()+1);
    }
    //缩小
    var _toSmall = function(data){
        var map = mapTemp[data.arg[1]];
        map.getView().setZoom(map.getView().getZoom()-1);
    }
    //1：1显示
    var _oneToOne = function(data){
        var map = mapTemp[data.arg[1]];
        var point = data.arg[2];
        //point = _changeCoord("EPSG:4326","EPSG:3857",point);
        map.getView().setCenter(point);
        map.getView().setZoom(14);
    }
    //当前点居中
    var _setPointCenter = function(data){
        var map = mapTemp[data.arg[1]];
        var point = data.arg[2];
        //point = _changeCoord("EPSG:4326","EPSG:3857",point);
        map.getView().setCenter(point);
        //map.O.view.A.center = point;
    }
    //添加点操作
    var featureOverlayTemp = {};
    var featuresTemp = {};
    var vectorSourceTemp = {};
    var orderList = [] ;
    var pointIdList = [];
    var index = 0;
    var popArr = [];
    var popArrObj = {};
    function _addPoint(data) {
        var grid_7 = data.arg[1];
        var mapId = data.arg[2];
        var point = [];
        var fun = data.arg[3];
        var pointId = data.arg[4];
        //for(var key in mapTemp) {//不使用过滤
        var map = mapTemp[mapId];
        var features;
        if(undefined == featuresTemp[mapId]){
            features = new ol.Collection();
        }else{
            features = featuresTemp[mapId];
        }
        var vectorSource
        if(undefined == vectorSourceTemp[mapId]){
            vectorSource = new ol.source.Vector({features: features});
        }else{
            vectorSource = vectorSourceTemp[mapId];
        }
        var featureOverlay = new ol.layer.Vector({
            source: vectorSource,
            style:new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                image:new ol.style.Icon({
                    anchor: [10,10],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    imgSize:[21,21],
                    src:"img/21px.png"
                })
                //geometry:function(feature){
                //    var coordinates = feature.getGeometry().getCoordinates()[0];
                //    return feature.getGeometry();
                //}
            })
        });
        featureOverlay.setMap(map);

        //var modify = new ol.interaction.Modify({
        //    features: features,
        //    // the SHIFT key must be pressed to delete vertices, so
        //    // that new vertices can be drawn at the same position
        //    // of existing vertices
        //    deleteCondition: function (event) {
        //        return ol.events.condition.shiftKeyOnly(event) &&
        //            ol.events.condition.singleClick(event);
        //    }
        //});
        //map.addInteraction(modify);
        //modify.on("modifyend", onModifyEnd, this);
        //modify.on("modifystart", onModifyStart, this);
        //modify.changed(onDrawEnd);
        var draw; // global so we can remove it later
        //var typeSelect = document.getElementById('type');
        function addInteraction() {
            draw = new ol.interaction.Draw({
                features: features,
                type: /** @type {ol.geom.GeometryType} */ ("Point"),
                style:function(feature) {
                    return [
                        new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: '#ffcc33',
                                width: 2
                            }),
                            image:new ol.style.Icon({
                                anchor: [10,10],
                                anchorXUnits: 'pixels',
                                anchorYUnits: 'pixels',
                                imgSize:[21,21],
                                src:"img/21px.png"
                            })
                            //geometry:function(feature){
                            //    var coordinates = feature.getGeometry().getCoordinates()[0];
                            //    return feature.getGeometry();
                            //}
                        })
                    ]
                }
            });
            map.addInteraction(draw);
            draw.on("drawend", onDrawEnd, this);
        }

        //function onModifyStart(event) {
        //    var lon = event.target.a.b.data.ba;
        //    var lat = event.target.a.b.data.ga;
        //    //var newData = ["image4", "imageA", "true", lon, lat];
        //    //grid_7.forEachRowInGroup("John", function (id) {
        //    //    id;
        //    //});
        //    //grid_7.addRow(3, newData);
        //}

        //function onModifyEnd(event) {
        //    mapTemp[mapId].removeInteraction(draw);
        //    var lon = event.target.a.b.data.ba;
        //    var lat = event.target.a.b.data.ga;
        //    point[lon] = lon;
        //    point[lat] = lat;
        //    var img = "img"+mapId;
        //    var newData = [img, "imageA", "true", lon, lat];
        //    grid_7.addRow(3, newData);
        //    return point;
        //}

        function onDrawEnd(event) {
            features;
            var uuid =  _uuid();
            event.feature.id = uuid;
            mapTemp[mapId].removeInteraction(draw);
            var coordinates = event.feature.getGeometry().getCoordinates();   //获取坐标
            var lon = coordinates[0];// target.a[0];
            var lat = coordinates[1];//event.target.a[1];
            point[0] = lon;
            point[1] = lat;
            var tempPoint = {
                id:uuid,
                point:[lon,lat]
            }
            point = _changeCoord("EPSG:3857","EPSG:4326",point);
            //point[0] = point[0].toFixed(6);
            //point[1] = point[1].toFixed(6);

            //没点时，获取最大的行号、点ID号
            if(orderList.length<=0 && pointIdList.length <= 0){
                //grid_7.forEachRow(function(id){  //循环每一行
                //    grid_7.forEachCell(id,function(cellObj,index){  //循环每一行的每一个cell,每个cell的id为index，对象为cellObj
                //        if(index === 0){
                //            orderList.push(cellObj.getValue());
                //        }
                //        if(index === 1){
                //            pointIdList.push(cellObj.getValue());
                //        }
                //    });
                //});
                orderList.push(0);
                pointIdList.push(0);
            }

            var numOrder = Math.max.apply(null,orderList) + 1;  // 获取最大的加1
            var pointID= Math.max.apply(null,pointIdList) + 1;
            orderList = [];   //置空，只保留最大值
            pointIdList = [];
            orderList.push(numOrder);
            pointIdList.push(pointID);

            //给每个刺点显示其点ID的容器
            $('#smallPop').append('<div id="pop'+index+pointID+'" style="color: red;font-size: 14px;">&nbsp;'+pointID+'</div>');

            var pop = new ol.Overlay({
                element:document.getElementById('pop'+index+pointID), //挂载点
                position: coordinates,    //设置其位置
                positioning: 'top-left'   //显示位置的方向
            });
            map.addOverlay(pop);  // 地图添加
            popArr.push(pop);
            popArrObj[uuid] = pop;

            var img = "img"+mapId;
            //添加一行信息  序号，点ID，点类型。。。。。。。
            var rowData = [uuid,numOrder,pointId,img,3,"1",__mapCoordinateFixed4(coordinates[0]),__mapCoordinateFixed4(coordinates[1]),"0"];
            grid_7.addRow(numOrder,rowData,false);  //行的ID 与序号号值是一样的
            var newData = { id:numOrder, data: rowData};
            //var newData = [img, "imageA", "true", point[0].toFixed(6), point[1].toFixed(6)];
            //grid_7.addRow(3, newData);
            fun(tempPoint,newData) ;


        }

        map.on('click', function (evt) {
            evt;
            features;
        })
        /**
         * Handle change event.
         */
            //typeSelect.onchange = function() {
            //    map.removeInteraction(draw);
            //    addInteraction();
            //};
        addInteraction();
        featureOverlayTemp[mapId] = featureOverlay;
        featuresTemp[mapId] = features;
        vectorSourceTemp[mapId] = vectorSource;
    }
    //处理地图坐标，默认保留四位小数
    var __mapCoordinateFixed4 = function(target) {
        return  (Math.round(target *10000))/10000;
    };
    //编辑点操作
    var modify;
    function _editPoint(data) {
        var grid_7 = data.arg[1];
        var mapId = data.arg[2];
        var point = [];
        var fun = data.arg[3];
        var gridData = data.arg[4];
        var map = mapTemp[mapId];
        var features = featuresTemp[mapId];
        //var modify = new ol.interaction.Modify({
        //    features: features,
        //    // the SHIFT key must be pressed to delete vertices, so
        //    // that new vertices can be drawn at the same position
        //    // of existing vertices
        //    deleteCondition: function (event) {
        //        return ol.events.condition.shiftKeyOnly(event) &&
        //            ol.events.condition.singleClick(event);
        //    }
        //});
        //map.addInteraction(modify);
        //modify.on("modifyend", onModifyEnd, this);
        //modify.on("modifystart", onModifyStart, this);
        var uuid;
        //function onModifyStart(event) {
        //    //var lon = event.target.a.b.data.ba;
        //    //var lat = event.target.a.b.data.ga;
        //    var coordinates = event.features.getGeometry().getCoordinates();   //获取坐标
        //    var lon = coordinates[0];// target.a[0];
        //    var lat = coordinates[1];
        //    var uuids = event.features.a;
        //    uuids.forEach(function(data){
        //        if(data.O.geometry.B[0] == lon && data.O.geometry.B[1] ==lat){
        //            uuid = data.id;
        //        }
        //    })
        //}

        //function onModifyEnd(event) {
        //    mapTemp[mapId].removeInteraction(modify);
        //    //var lon = event.target.a.b.data.ba;
        //    //var lat = event.target.a.b.data.ga;
        //    var pointID = event.id;
        //    var coordinates = event.features.getGeometry().getCoordinates();   //获取坐标
        //    var lon = coordinates[0];// target.a[0];
        //    var lat = coordinates[1];
        //    point[0] = lon;
        //    point[1] = lat;
        //    var tempPoint = {
        //        id:uuid,
        //        point:[lon,lat]
        //    }
        //    point = _changeCoord("EPSG:3857","EPSG:4326",point)
        //    //point[0] = point[0].toFixed(6);
        //    //point[1] = point[1].toFixed(6);
        //    //没点时，获取最大的行号、点ID号
        //    var numOrder = 0;
        //    if(orderList.length<=0 && pointIdList.length <= 0){
        //        grid_7.forEachRow(function(id){  //循环每一行
        //            grid_7.forEachCell(id,function(cellObj,index){  //循环每一行的每一个cell,每个cell的id为index，对象为cellObj
        //                if(index === 1){
        //                    if(pointID == cellObj.getValue()){
        //                        numOrder = id;
        //                    }
        //                }
        //            });
        //        });
        //    }
        //
        //
        //    popArrObj.forEach(function(data){
        //        if(data.id == uuid){
        //            popArrObj[uuid].setPosition([lon,lat]);
        //        }
        //    })
        //    var img = "img"+mapId;
        //    var rowData = [numOrder,pointID,img,3,"1",__mapCoordinateFixed4(coordinates[0]),__mapCoordinateFixed4(coordinates[1]),"0"];
        //    grid_7.addRow(numOrder,rowData,false);
        //    fun(tempPoint);
        //}


        var selectedPointID ;
        var selectPoint = new ol.interaction.Select();   //实例化交互选择，操作要素
        map.addInteraction(selectPoint);
        selectPoint.on('select',function(event){
            event.preventDefault();
            event.stopPropagation();
            event.selected[0].setStyle(new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 10
                }),
                image:new ol.style.Icon({
                    anchor: [10,10],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    imgSize:[21,21],
                    src:"img/21px.png"
                })
                //geometry:function(feature){
                //    var coordinates = feature.getGeometry().getCoordinates()[0];
                //    return feature.getGeometry();
                //}
            }));
            selectedPointID = event.selected[0].getId();   // 得到选择的要素的id值
            uuid = event.selected[0].id;
            map.removeInteraction(selectPoint);           //移除交互
        });
        modify = new ol.interaction.Modify({            // 修改要素
            features:selectPoint.getFeatures()
        });
        map.addInteraction(modify);                //添加修改交互

        modify.on('modifyend',function(event){     //修改完成后，将修改的要素坐标更新到 points中
            event.preventDefault();
            event.stopPropagation();
            map.removeInteraction(modify);

            var x=event.mapBrowserEvent.coordinate[0];   //当鼠标松开时，获取当前点坐标
            x =__mapCoordinateFixed4(x);
            var y=event.mapBrowserEvent.coordinate[1];
            y = __mapCoordinateFixed4(y);
            var tempPoint = {
                        id:uuid,
                        point:[x,y]
                    }
            //for(var i=0;i<points.length;i++){          //将当前修改点的坐标替换掉原来的坐标
            //    if(points[i].id === selectedPointID){
            //        points[i].singlePointtCoordinateX = x;
            //        points[i].singlePointtCoordinateY = y;
            //        popArr[i].setPosition([x,y]);         //将当前点的显示id 跟着修改点变化
            //    }
            //}
            i = null;
                //没点时，获取最大的行号、点ID号
                var numOrder = 0;
                var pointIdList = [];
                if(orderList.length<=0 && pointIdList.length <= 0){
                    grid_7.forEachRow(function(id){  //循环每一行
                        grid_7.forEachCell(id,function(cellObj,index){  //循环每一行的每一个cell,每个cell的id为index，对象为cellObj
                            if(index === 1){
                                if(uuid == cellObj.getValue()){
                                    numOrder = id;
                                    pointIdList.push(cellObj.getValue());
                                }
                            }
                        });
                    });
                }
                var pointID= Math.max.apply(null,pointIdList);
                var img = "img"+mapId;
                //var rowData = [numOrder,pointID,img,3,"1",__mapCoordinateFixed4(x),__mapCoordinateFixed4(y),"0"];
                //grid_7.addRow(numOrder,rowData,false);
                grid_7.forEachRow(function(id){
                    grid_7.forEachCell(id,function(cellObj,index){
                        if(index == 0){
                            if(cellObj.getValue() == uuid){
                                grid_7.cells(id, 6).cell.innerHTML = x;
                                grid_7.cells(id, 7).cell.innerHTML = y;
                                gridData.rows[id-1].data[6] = x;
                                gridData.rows[id-1].data[7] = y;
                            }
                        }
                    });
                });
            popArrObj[uuid].setPosition([x,y]);
                fun(tempPoint,gridData);

        },this);//可以传入函数名，不使用匿名函数
        map.on('click', function (evt) {
            evt;
        })
        /**
         * Handle change event.
         */
        //typeSelect.onchange = function() {
        //    map.removeInteraction(draw);
        //    addInteraction();
        //};
        //addInteraction();
        //featureOverlayTemp[map] = featureOverlay;

    }
    function _selectPoint(data){
        var mapId = data.arg[2];
        var map = mapTemp[mapId];
        var vectorSource = vectorSourceTemp[mapId];
        var fun = data.arg[3]
        // a normal select interaction to handle click
        var select = new ol.interaction.Select();

        map.addInteraction(select);
        select.setActive(true);
        var selectedFeatures = select.getFeatures();

        // a DragBox interaction used to select features by drawing boxes
        var dragBox = new ol.interaction.DragBox({
            condition: ol.events.condition.platformModifierKeyOnly
        });

        map.addInteraction(dragBox);

        //var infoBox = document.getElementById('info');
        //var WsShell = new ActiveXObject('WScript.Shell')
        //WsShell.SendKeys('{F11}');
        dragBox.on('boxend', function() {
            // features that intersect the box are added to the collection of
            // selected features, and their names are displayed in the "info"
            // div
            var info = [];
            var extent = dragBox.getGeometry().getExtent();
            vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
                selectedFeatures.push(feature);
                //info.push(feature.get('name'));
            });
            fun(selectedFeatures);
        });

        // clear selection when drawing a new box and when clicking on the map
        dragBox.on('boxstart', function() {
            selectedFeatures.clear();
            //infoBox.innerHTML = '&nbsp;';
        });
        map.on('click', function() {
            selectedFeatures.clear();
            //infoBox.innerHTML = '&nbsp;';
        });
    }
    //删除单个点操作
    function _removeOnePoint1(data) {
        var grid_7 = data.arg[1];
        var mapId = data.arg[2];
        var fun = data.arg[3];
        var map = mapTemp[mapId];
        var features = featuresTemp[mapId];
        //features.removePoint();
        //features = featureOverlayTemp[mapId].getSource().getFeatures();
        var modify = new ol.interaction.Modify({
            features: features,
            // the SHIFT key must be pressed to delete vertices, so
            // that new vertices can be drawn at the same position
            // of existing vertices
            deleteCondition: function (event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        map.addInteraction(modify);
        modify.on("modifystart", onModifyStart, this);
        function onModifyStart(event) {
            var feature = event.target.f;
            mapTemp[mapId].removeInteraction(modify);
            //var featureOverlay = featureOverlayTemp[data.arg[2]];
            var features = featuresTemp[mapId];
            var tempPoint;
            for(var i = 0;i<features.getLength();i++){
                var tempFeature = features.item(i);
                if(tempFeature.O.geometry.B[0] == feature.O.geometry.B[0] && features.item(i).O.geometry.B[1] == feature.O.geometry.B[1]){
                    features.removeAt(i);
                    tempPoint = {
                        id:tempFeature.id,
                        point:[tempFeature.O.geometry.B[0],features.item(i).O.geometry.B[1]]
                    }
                    fun(tempPoint);
                }

            }
        }
    }
    function _removeOnePoint(data) {
        var grid_7 = data.arg[1];
        var mapId = data.arg[2];
        var fun = data.arg[3];
        var gridData = data.arg[4];
        var map = mapTemp[mapId];
        var $pointIdPop = $("#pointIdPop");
        $pointIdPop.css({"display":"block"}).fadeIn(500);    //透明蒙层，用于只能操作删除弹出层
        $("#popContainer").addClass("popContainer").fadeIn(500); // 显示删除弹出层
        drapableObj($pointIdPop);                               //弹出层可以拖拽
        $(".deletePop").on('click',function(){     //删除弹出层
            $pointIdPop.css({"display":"none"}).fadeOut(500);
            $("#popContainer").removeClass("popContainer").fadeOut(500);
        });
        //var features = featuresTemp[mapId];
        //features.removePoint();
        //features = featureOverlayTemp[mapId].getSource().getFeatures();
        //var modify = new ol.interaction.Modify({
        //    features: features,
        //    // the SHIFT key must be pressed to delete vertices, so
        //    // that new vertices can be drawn at the same position
        //    // of existing vertices
        //    deleteCondition: function (event) {
        //        return ol.events.condition.shiftKeyOnly(event) &&
        //            ol.events.condition.singleClick(event);
        //    }
        //});
        //map.addInteraction(modify);
        //modify.on("modifystart", onModifyStart, this);
        //function onModifyStart(event) {
        //    var feature = event.target.f;
        //    mapTemp[mapId].removeInteraction(modify);
            //var featureOverlay = featureOverlayTemp[data.arg[2]];
            var features = featuresTemp[mapId];
            var tempPoint;
        $(".pointIdInfo").on('keydown',function(event){   //回车删除要删除的点
            event.stopPropagation();
            var $value = parseInt($(this).val());
            if(event.keyCode == "13") {
                for(var i = 0;i<features.getLength();i++){
                    var tempFeature = features.item(i);
                    grid_7.forEachRow(function(id){
                        grid_7.forEachCell(id,function(cellObj,index){
                            if(index == 1){
                                if(cellObj.getValue() == $value){
                                    var uuid = grid_7.cells(id, 0).cell.innerHTML;
                                    if(tempFeature.id == uuid){
                                        features.removeAt(i);
                                        grid_7.deleteRow(id);
                                        var index = _getArrIndex(gridData.rows,uuid);
                                        gridData.rows.splice(index,1);
                                        map.removeOverlay(popArrObj[uuid]);
                                        tempPoint = {
                                            id:tempFeature.id,
                                            point:[0,0]
                                            }
                                    }
                                }
                            }
                        });
                    });
                }
                $pointIdPop.css({"display":"none"}).fadeOut(500);
                $("#popContainer").removeClass("popContainer").fadeOut(500);
                fun(tempPoint,gridData);
            }

        });
            //var tempPoint;
            //for(var i = 0;i<features.getLength();i++){
            //    var tempFeature = features.item(i);
            //    if(tempFeature.O.geometry.B[0] == feature.O.geometry.B[0] && features.item(i).O.geometry.B[1] == feature.O.geometry.B[1]){
            //        features.removeAt(i);
            //        tempPoint = {
            //            id:tempFeature.id,
            //            point:[tempFeature.O.geometry.B[0],features.item(i).O.geometry.B[1]]
            //        }
            //        fun(tempPoint);
            //    }
            //
            //}
        //}
    }
    function _getArrIndex(arr,uuid){
        for(var i=0;i<arr.length;i++){
            var item = arr[i];
            if(item.data[0] == uuid){
                return i;
            }
        }
    }
    //删除全部点操作
    function _removePoint(data) {
        var grid_7 = data.arg[1];
        var map = mapTemp[data.arg[2]];
        var fun = data.arg[3];
        var gridData = data.arg[4];
        var featureOverlay = featureOverlayTemp[data.arg[2]];
        featureOverlay.getSource().clear();
        map.removeOverlay(featureOverlay);
        //var features = featuresTemp[data.arg[2]];
        //features.clearAll();
        for(var k in popArrObj){
            map.removeOverlay(popArrObj[k]);
        }
        grid_7.clearAll();
        gridData.rows = [];
        fun(gridData);
    }
    //调整颜色
    function _changeColor(id,data,mapId) {
        controlId[id].value = data;
        rasterTemp[mapId].changed();
    }
    //坐标转换
    function  _changeCoord(source,target,coordinate){
        var lonlat = ol.proj.transform(coordinate, source, target);
        //lonlat[0] = lonlat[0].toFixed(6);
        //lonlat[1] = lonlat[1].toFixed(6);
        return lonlat;
    }
    //生成UUID
    function _uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    //拖拽函数
    var drapableObj = function(obj){
        obj.on("mousedown",function(event){
            event.stopPropagation();
            /* 获取需要拖动节点的坐标 */
            var offset_x = $(this)[0].offsetLeft;//x坐标
            var offset_y = $(this)[0].offsetTop;//y坐标
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
                var now_x = (offset_x + _x ) ;
                var now_y = (offset_y + _y );
                obj.css({
                    top:now_y + "px",
                    left:now_x + "px"
                });
            });
        });
        /* 当鼠标左键松开，接触事件绑定 */
        $(document).on("mouseup",function(event){
            event.stopPropagation();
            $(this).off("mousemove");
        });
    };
    return {
        createMap:_createMap,
        addPoint:_addPoint,
        removePoint:_removePoint,
        changeColor:_changeColor,
        editPoint:_editPoint,
        removeOnePoint:_removeOnePoint,
        changeCoord:_changeCoord,
        selectPoint:_selectPoint,
        fullView:_fullView,
        setPointCenter:_setPointCenter,
        oneToOne:_oneToOne,
        toBig:_toBig,
        toSmall:_toSmall,
        moveMap:_moveMap,
        unMoveMap:_unMoveMap
    };
});