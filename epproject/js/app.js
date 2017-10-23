/**
 * Created by domea on 17-6-2.
 */
'use strict';
(function(root){
    require(["config"], function(config){
        requirejs.config(config);
        require(['app/ui/main','app/leftTree/leftTree','domReady!'], function(ui,tree){
            window.restUrl = 'http://192.168.48.2:8283/';
            ui.test();
            tree.initTree();
        });
    });
})(this);