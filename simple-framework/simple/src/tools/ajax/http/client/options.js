/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/http/client/options'
}, function (require, module, exports, Simple) {

    "use strict";

    var W3C = !(Simple.platform.ie && Simple.platform.ie < 10);

    /**
     * 配置初始化
     * @param options
     * @param http
     */
    module.exports = function (options, http, LastModified, ETag) {

        /**
         * header信息
         * @type {options.headers|{x-timestamp, x-sent}}
         */
        var headers = options.headers;

        /**
         * 自定义属性
         */
        if (W3C) {
            if (options.xhrFields) {
                for (var e in options.xhrFields) {
                    http[e] = options.xhrFields[e];
                }
            }
        }

        /**
         * 设置请求头
         */
        for (var e in headers) {
            if (headers[e]) {
                http.setRequestHeader(e, headers[e] + "");
            }
        }

        /**
         * 设置contentType
         */
        if ((options.data && options.contentType !== false || options.contentType)) {
            http.setRequestHeader("Content-Type", options.contentType);
        }

        /**
         * 设置mime
         */
        if (options.mimeType && http.overrideMimeType) {
            http.overrideMimeType(options.mimeType);
        }

        /**
         * 设置缓存
         */
        if (options.ifModified && http.setRequestHeader) {
            if (LastModified[options.url]) {
                http.setRequestHeader("If-Modified-Since", LastModified[options.url]);
            }
            if (ETag[options.url]) {
                http.setRequestHeader("If-None-Match", ETag[options.url]);
            }
        }

    };

});