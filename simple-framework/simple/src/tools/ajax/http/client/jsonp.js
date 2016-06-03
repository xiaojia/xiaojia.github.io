/*
 * main
 *
 * name: xiaojia
 * date: 16/4/27
 */

Simple.Module({
    name: 'simple:tools/ajax/http/client/jsonp'
}, function (require, module, exports, Simple) {

    "use strict";

    /**
     * 实现 JSONP 接口, 代替 XmlHttpRequest 方法
     * @param options
     * @constructor
     */
    var JSONP = function (options) {
        this.options = options;
        this.readyState = 0;
    };

    JSONP.prototype = {

        /**
         * getAllResponseHeaders接口, JSONP不支持
         * @returns {string}
         */
        getAllResponseHeaders: function () {
            return '';
        },

        /**
         * getResponseHeader, JSONP不支持
         * @returns {string}
         */
        getResponseHeader: function () {
            return '';
        },

        /**
         * setRequestHeader接口, JSONP不支持
         */
        setRequestHeader: function () {

        },

        /**
         * overrideMimeType接口, JSONP不支持
         */
        overrideMimeType: function () {

        },

        /**
         * 发送数据, JSONP 通过创建 SCRIPT 标签实现请求, 只支持 GET
         * @param params
         */
        send: function (params) {

            var that = this;
            var options = that.options;
            var callbackName = options.callbackName || 'SimpleAjaxJsonp_' + Math.random().toString(16).substring(2);

            var src = params ? (that.url + (that.url.indexOf('?') > -1 ? '&' : '?') + params) : this.url;

            var script = that.script = document.createElement('script');
            script.src = src + (that.url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callbackName;

            if (options.charset) {
                script.charset = options.charset;
            }

            /**
             * 回调方法
             * @param success
             * @param statusText
             * @param statusCode
             * @param data
             */
            var callback = function (success, statusText, statusCode, data) {

                callback = null;

                that.responseURL = src;
                that.status = statusCode;
                that.statusText = statusText;

                if (success) {
                    that.response = data;
                    that.responseText = data;
                }

            };

            /**
             * 创建全局回调方法
             * @param data
             */
            window[callbackName] = function (data) {
                if (!that.isAbort) {
                    that.readyState = 4;
                    script.setAttribute('spl-jsonp-status', 'success');
                    callback(true, 'OK', 200, data);
                } else {
                    callback(false, 'abort', 404);
                }
            };

            /**
             * 监听 SCRIPT load
             * @type {JSONP.script.onreadystatechange}
             */
            script.onload = script.onreadystatechange = function (e) {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    script.onreadystatechange = script.load = null;
                    if (script.getAttribute('spl-jsonp-status') !== 'success') {
                        callback(false, 'error', 404);
                    }
                    window[callbackName] = null;
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    script = null;
                    that.onreadystatechange && that.onreadystatechange(e);
                }
            };

            document.head.appendChild(script);

        },

        /**
         * 请求的 URL 地址, JSONP只能通过GET形式请求
         * @param method
         * @param url
         */
        open: function (method, url) {
            this.url = url;
        },

        /**
         * 取消请求
         */
        abort: function () {
            var that = this;
            that.isAbort = true;
            if (that.script.parentNode) {
                that.script.parentNode.removeChild(that.script);
            }
        }

    };

    JSONP.prototype.constructor = JSONP;

    module.exports = function (options) {
        return new JSONP(options);
    };

});