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

    var utils = Simple.Utils;
    var W3C = !(Simple.platform.ie && Simple.platform.ie < 10);

    /**
     * 对象转换成字符串
     * @param a
     * @param traditional
     * @returns {string}
     */
    var objectToParam = function (a, traditional) {

        function buildParams(prefix, obj, traditional, add) {
            var name,
                rbracket = /\[\]$/;

            if (utils.isArray(obj)) {

                utils.each(obj, function (v, i) {
                    if (traditional || rbracket.test(prefix)) {
                        add(prefix, v);

                    } else {
                        buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                    }
                });

            } else if (!traditional && typeof obj === "object") {
                for (name in obj) {
                    buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                }
            } else {
                add(prefix, obj);
            }
        }

        var prefix,
            s = [],
            add = function (key, value) {
                key = encodeURIComponent(key);
                value = utils.isFunction(value) ? value() : (value == null ? "" : value);
                if (utils.isArray(value)) {
                    value = value[0];
                    utils.each(value.concat(), function (v) {
                        value = '&' + key + '=' + encodeURIComponent(v);
                    });
                } else {
                    value = encodeURIComponent(value);
                }
                s[s.length] = key + "=" + value;
            };

        if (utils.isArray(a)) {
            utils.each(a, function (v) {
                add(v.name, v.value);
            });

        } else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        return s.join("&").replace(/%20/g, "+");

    };

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

    /**
     * 需要单独运行
     * @param options
     */
    module.exports.paramsHandle = function (options) {

        /**
         * 格式化数据, object to string
         */
        if (typeof options.params !== 'string' && options.processData) {
            options.params = objectToParam(options.data, options.traditional);
        }

        /**
         * 如果是GET，则合并数据
         */
        if (options.method === 'GET' && options.data && options.processData) {
            options.url += (options.url.indexOf('?') > -1 ? '&' : '?') + options.params;
            options.params = null;
        }

        /**
         * 增加缓存字段
         */
        if (!options.cache) {
            options.url += (options.url.indexOf('?') > -1 ? '&' : '?') + '_=' + Math.random();
        }

    }

});