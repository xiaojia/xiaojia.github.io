/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/http/main',
    require: [
        './client/main',
        './request/script-jsonp-request',
        './request/x-domain-request',
        './request/xml-http-request'
    ]
}, function (require, module, exports, Simple) {

    var client = require('./client/main');

    /**
     * jsonp
     * @type {(function(): JSONP)|*|exports|module.exports}
     */
    var scriptJsonpRequest = require('./request/script-jsonp-request');

    /**
     * ie8 XDomainRequest 对象
     * @type {*|exports|module.exports}
     */
    var xDomainRequest = require('./request/x-domain-request');

    /**
     * xmlHttpReqeust, ie678使用ActiveXObject
     * @type {*|exports|module.exports}
     */
    var xmlHttpRequest = require('./request/xml-http-request');

    /**
     * ie版本
     * @type {boolean}
     */
    var IE = Simple.platform.ie;

    module.exports = function (options) {

        /**
         * 如果是 node 则用 node http 请求数据
         */
        if (Simple.platform.node) {

            /**
             * node http
             */
            options.xhr = Simple.Server.Tools.http;

            /**
             * node 端没有 jsonp 格式
             */
            options.jsonp = false;

        } else {

            /**
             * 强制使用jsonp形式
             */
            if (Simple.platform.browser && options.jsonp) {
                options.xhr = scriptJsonpRequest;
            } else {

                /**
                 * 是否启用跨域请求
                 */
                if (options.crossDomain) {

                    if (IE) {

                        if (IE < 8) {
                            /**
                             * 小于IE8使用jsonp形式
                             */
                            options.xhr = scriptJsonpRequest;
                        } else if (IE === 8) {
                            /**
                             * ie8采用xDomainRequest方案
                             * @type {*|exports|module.exports}
                             */
                            options.xhr = xDomainRequest;
                        } else {
                            /**
                             * 其他高级浏览器使用xmlHttpRequest
                             * @type {*|exports|module.exports}
                             */
                            options.xhr = xmlHttpRequest;
                        }

                    } else {
                        /**
                         * 其他高级浏览器使用xmlHttpRequest
                         * @type {*|exports|module.exports}
                         */
                        options.xhr = xmlHttpRequest;
                    }

                }

            }

            return client(options);

        }

    }

});