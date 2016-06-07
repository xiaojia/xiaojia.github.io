/*
 * xml-http-request
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/http/request/x-domain-request'
}, function (require, module, exports, Simple) {

    "use strict";

    /**
     * 实现 JSONP 接口, 代替 XmlHttpRequest 方法
     * @param options
     * @constructor
     */
    var xDdomain = function (options) {
        var that = this;
        that.options = options;
        that.readyState = 0;
        that.isAbort = false;
    };

    xDdomain.prototype = {

        /**
         * getAllResponseHeaders接口
         * @returns {string}
         */
        getAllResponseHeaders: function () {
            return 'context-type: ' + this.http.contentType;
        },

        /**
         * getResponseHeader
         * @returns {string}
         */
        getResponseHeader: function () {
            return '';
        },

        /**
         * setRequestHeader接口
         */
        setRequestHeader: function () {

        },

        /**
         * overrideMimeType接口
         */
        overrideMimeType: function () {

        },

        /**
         * @param params
         */
        send: function (params) {

            var that = this;
            var options = that.options;

            /**
             * 回调
             * @param statusCode
             * @param statusText
             * @param responseText
             */
            var callback = function (statusCode, statusText, responseText) {

                that.responseURL = options.url;

                /**
                 * 如果超时
                 */
                if (that.isAbort) {
                    that.status = 404;
                    that.statusText = 'timeout';
                } else {
                    that.status = statusCode || 200;
                    that.statusText = statusText || 'OK';
                }

                that.response = responseText || http.responseText;
                that.responseText = responseText || http.responseText;

                that.isAbort = false;

                that.readyState = 4;
                that.onreadystatechange && that.onreadystatechange();

            };

            /**
             * 创建http对象
             * @type {XDomainRequest}
             */
            var http = that.http = new XDomainRequest();

            /**
             * 设置method, url
             */
            http.open(that.method, that.url);

            /**
             * 设置超时时间
             * @type {number|*|Number}
             */
            http.timeout = 1;

            /**
             * 加载成功
             */
            http.onload = callback;

            /**
             * 失败
             */
            http.onerror = function () {
                callback('500', 'error', '');
            };

            /**
             * 发送请求
             */
            http.send(params || null);

        },

        /**
         * @param method
         * @param url
         */
        open: function (method, url) {
            this.method = method;
            this.url = url;
        },

        /**
         * 取消请求
         */
        abort: function () {
            var that = this;
            that.isAbort = true;
            if (that.http) {
                that.http.abort();
            }
        }

    };

    xDdomain.prototype.constructor = xDdomain;

    module.exports = function (options) {
        return new xDdomain(options);
    };

});