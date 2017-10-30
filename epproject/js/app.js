/**
 * Created by domea on 17-6-2.
 */
'use strict';
(function(root){
    require(["config"], function(config){
        requirejs.config(config);
        require(['app/ui/main','app/leftTree/leftTree','domReady!'], function(ui,tree){
            window.restUrl = 'http://192.168.4.221:8283/';
            window.getLayerUrl = "http://192.168.4.2:18080/geowebcache/api/layers/get/";
            ui.test();
            tree.initTree();
        });
    });
})(this);