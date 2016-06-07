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

    /**
     * 配置token
     * @param value
     * @param key
     */
    module.exports.token = function (value, key) {
        globalOptions.token = {
            key: key || 'token',
            value: value || ''
        }
    };

    /**
     * node读取过的数据, 保证浏览器不会二次获取
     * @type {{}}
     */
    module.exports.nodeData = {};

    /**
     * 设置数据
     * @param key
     * @param value
     */
    module.exports.setData = function (key, value) {
        module.exports.nodeData[key] = value;
    };

    /**
     * 获取数据, 保证只是页面渲染第一次才会读取
     * @param key
     * @returns {*}
     */
    module.exports.getData = function (key) {
        var data = module.exports.nodeData[key];
        if (data) {
            delete module.exports.nodeData[key];
            return data;
        } else {
            return null;
        }
    };

});