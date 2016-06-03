/*
 * main
 *
 * name: xiaojia
 * date: 16/4/27
 */

Simple.Module({
    name: 'simple:tools/ajax/main',
    require: [
        './methods/request',
        './methods/get',
        './methods/post',
        './methods/html',
        './methods/request/options'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;
    var globalOptions = require('./methods/request/options');

    /**
     * request
     * @type {*|exports|module.exports}
     */
    module.exports = require('./methods/request');

    /**
     * get
     * @type {*|exports|module.exports}
     */
    module.exports.get = require('./methods/get');

    /**
     * post
     * @type {*|exports|module.exports}
     */
    module.exports.post = require('./methods/post');

    /**
     * html
     * @type {*|exports|module.exports}
     */
    module.exports.html = require('./methods/html');

    /**
     * 全局配置
     */
    module.exports.setting = function (options) {
        utils.extend(globalOptions, options);
    };

});