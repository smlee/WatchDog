"use strict";
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function (app) {

    var root = app.getValue('projectRoot');

    var npmPath = path.join(root, './node_modules');
    var publicPath = path.join(root, './public');
    var browserPath = path.join(root, './browser');
    var webcamPath = path.join(root, './node_modules/webcamjs');    
    var howlerPath = path.join(root, './node_modules/howler');  
    var fontawesomePath = path.join(root, './node_modules/font-awesome');
    //var bowerPath = path.join(root, './bower_components');

    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(webcamPath));
    app.use(express.static(npmPath));
    app.use(express.static(publicPath));
    app.use(express.static(browserPath));
    app.use(express.static(howlerPath));
    app.use(express.static(fontawesomePath));

};
