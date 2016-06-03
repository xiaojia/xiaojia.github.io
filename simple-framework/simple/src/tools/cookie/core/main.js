/*
 * main
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:tools/cookie/core/main'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    /**
     * 获取cookie
     * @param name
     * @returns {string}
     */
    var getCookie = function (name) {
        var cookie = utils.split(document.cookie, ';', '=', true);
        return cookie[name] || '';
    };

    /**
     * 获取cookie
     * @param name
     * @param value
     * @param options
     * @param context
     */
    var setCookie = function (name, value, options, context) {

        var config = [];

        var expires = options.expires;
        var path = options.path;
        var domain = options.domain;
        var secure = options.secure;

        /**
         * 设置超时时间并取得格林威治时间
         */
        if (expires) {

            /**
             * 获取当前时间, 计算超时时间
             * @type {Date}
             */
            var now = new Date(Date.now() + expires);
            config.push('expires=' + now.toGMTString());

        }

        /**
         * 设置路径
         */
        path && (config.push('path=' + path));

        /**
         * 设置域名
         */
        domain && (config.push('domain=' + domain));

        /**
         * 是否安全cookie, 必须在安全连接下才生效, 否则创建会失效
         */
        secure && (config.push('secure'));

        /**
         * 转换成字符串形式
         * @type {string}
         */
        config = config.join(';');

        /**
         * 设置cookie
         * @type {string}
         */
        document.cookie = name + '=' + encodeURIComponent(value) + (config ? ';' + config : '');

    };

    /**
     * 移除cookie
     * @param name
     */
    var removeCookie = function (name) {
        document.cookie = name + '=;expires=' + new Date(Date.now() - 10000).toGMTString();
    };

    module.exports = {
        getCookie: getCookie,
        setCookie: setCookie,
        removeCookie: removeCookie
    };

});