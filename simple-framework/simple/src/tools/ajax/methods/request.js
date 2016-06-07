/*
 * request
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/request',
    require: [
        '../http/main',
        './request/options',
        './request/url',
        './request/response',
        '../main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var deferred = Simple.Deferred;
    var utils = Simple.Utils;

    var IE6 = (Simple.platform.ie && Simple.platform.ie === 6);

    /**
     * http对象
     * @type {*|exports|module.exports}
     */
    var http = require('../http/main');

    /**
     * 默认参数
     * @type {{canonical: boolean, rewriter: boolean}}
     */
    var defaultOptions = require('./request/options');

    /**
     * url处理程序
     */
    var urlFormatHandle = require('./request/url');

    /**
     * httpCallback
     * @param data 返回数据
     * @param response
     */
    var httpCallback = require('./request/response');

    /**
     * 因为是循环依赖, 所以在使用时在require
     * @type {null}
     */
    var ajax = null;

    /**
     * ajax请求
     * @param url
     * @param options
     * @returns {*}
     */
    module.exports = function (url, userOptions) {

        if (!ajax) {
            ajax = require('../main');
        }

        var dtd = deferred();

        /**
         * 复制配置
         */
        var options = utils.clone(userOptions);

        /**
         * 合并参数
         */
        options = utils.extend({}, defaultOptions, options);

        /**
         * url赋值
         */
        options.url = url;

        /**
         * 规范参数
         */
        options.method = options.method.toUpperCase();
        options.dataType = options.dataType.toUpperCase();

        /**
         * url处理
         */
        urlFormatHandle(options);

        /**
         * IE6有此属性会报错
         */
        if (IE6 && options.xhrFields) {
            delete options.xhrFields.withCredentials;
        }

        /**
         * 回调
         */
        options.callback = function (isSuccess, response) {
            httpCallback(dtd, options, isSuccess, response);
        };

        /**
         * 检查是否node读取过该数据
         */
        var nodeData = ajax.getData(options.url);

        if (nodeData) {

            /**
             * 转换成字符串
             */
            if (typeof nodeData !== 'string') {
                nodeData = JSON.stringify(nodeData);
            }

            /**
             * 直接回调
             */
            options.callback(true, {
                responseURL: options.url,
                status: '200',
                statusText: 'OK',
                text: nodeData
            });

        } else {

            /**
             * 增加token字段
             */
            if (options.token) {
                options.url += (options.url.indexOf('?') > -1 ? '&' : '?') + options.token.key + '=' + encodeURIComponent(options.token.value);
            }

            /**
             * 增加缓存字段
             */
            if (!options.cache) {
                options.url += (options.url.indexOf('?') > -1 ? '&' : '?') + '_=' + Math.random();
            }

            /**
             * 请求
             */
            var currentHttp = http(options);

        }

        /**
         * promise
         */
        var promise = dtd.promise();

        /**
         * 取消请求
         */
        promise.abort = function () {
            currentHttp.abort();
        };

        return promise;

    }

});