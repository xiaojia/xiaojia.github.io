/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/http/client/main',
    require: [
        './options',
        './cache'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    var cacheHandle = require('./cache');
    var optionsHandle = require('./options');

    var LastModified = {};
    var ETag = {};

    /**
     * 请求
     * @param options
     * @returns {*}
     */
    module.exports = function (options) {

        var http;

        /**
         * 超时
         */
        var timeoutTimer;

        /**
         * 是否支持进度
         * @type {boolean}
         */
        var notProgress = false;

        /**
         * 终止请求说明
         * @type {string}
         */
        var abortText = '', abortCode = '';

        ///**
        // * 是否有缓存
        // */
        //var isCache = false;

        ///**
        // * 如果读取缓存
        // */
        //if (options.cache) {
        //    isCache = cacheHandle(options);
        //}
        //
        ///**
        // * 如果有缓存则返回缓存
        // */
        //if (isCache) {
        //    return isCache;
        //}

        /**
         * 初始化xhr
         */
        http = options.xhr(options);

        /**
         * 请求
         */
        http.open(
            options.method,
            options.url,
            options.async,
            options.username || null,
            options.password || null
        );

        /**
         * 配置初始化
         */
        optionsHandle(options, http, LastModified, ETag);

        /**
         * 进度
         */
        if (http.upload && http.upload.addEventListener) {
            if (options.progress) {
                http.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total * 100;
                        options.progress.call(http, parseInt(percentComplete));
                    }
                }, false);
            }
        } else {
            notProgress = true;
        }

        /**
         * 请求回调
         */
        var requestCallback = function () {

            var modified;
            var statusCode, statusText, response, isSuccess;

            /**
             * 进度
             */
            if (notProgress && options.progress) {
                options.progress.call(http, parseInt((http.readyState / 4) * 100));
            }

            /**
             * 如果 requestCallback 为 null 并且状态为 4 则
             */
            if (requestCallback && http.readyState === 4) {

                /**
                 * 取消超时倒计时
                 */
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                response = {};
                requestCallback = void 0;
                http.onreadystatechange = utils.noop;

                statusCode = abortCode || http.status || 404;

                if (statusCode === 1223) {
                    statusCode = 204;
                }

                response.text = http.responseText;

                try {
                    statusText = abortText || http.statusText;
                } catch (e) {
                    statusText = abortText;
                }

                response.statusCode = statusCode;
                response.statusText = statusText;
                response.http = http;

                /**
                 * 获取单个头信息
                 * @param key
                 * @returns {null}
                 */
                response.getResponseHeader = function (key) {
                    var match = this.responsesHeaders[key.toLowerCase()];
                    return match == null ? null : match;
                };

                /**
                 * 转换所有headers
                 */
                response.responsesHeaders = (function () {
                    var match,
                        rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
                        responseHeaders = {},
                        responseHeadersString = http.getAllResponseHeaders();
                    while ((match = rheaders.exec(responseHeadersString))) {
                        responseHeaders[match[1].toLowerCase()] = match[2];
                    }
                    return responseHeaders;
                })();

                isSuccess = statusCode >= 200 && statusCode < 300 || statusCode === 304;

                if (isSuccess) {
                    if (options.ifModified) {
                        modified = response.getResponseHeader("Last-Modified");
                        if (modified) {
                            LastModified[options.url] = modified;
                        }
                        modified = response.getResponseHeader("etag");
                        if (modified) {
                            ETag[options.url] = modified;
                        }
                    }
                }

                options.callback(isSuccess, response);

                abortText = '';
                abortCode = '';

            }

        };

        /**
         * 超时
         */
        if (options.async && options.timeout > 0) {
            timeoutTimer = setTimeout(function () {
                abortText = 'timeout';
                abortCode = '404';
                http.abort && http.abort();
            }, options.timeout);
        }

        /**
         * 回调状态
         */
        http.onreadystatechange = requestCallback;

        /**
         * 发送之前
         */
        if (options.beforeSend) {
            options.beforeSend(options, http);
        }

        /**
         * 发送请求
         */
        http.send(options.params || null);

        return http;

    };

});