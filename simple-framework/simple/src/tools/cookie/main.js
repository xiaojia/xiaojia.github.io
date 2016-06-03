/*
 * main
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:tools/cookie/main',
    require: [
        './core/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var handle;
    var client = require('./core/main');

    /**
     * 判断平台
     */
    if (Simple.platform.node) {
        handle = Simple.Server.Tools.cookie;
    } else {
        handle = client;
    }

    module.exports = {

        /**
         * 获取cookie
         * @param name
         */
        getData: function (name, context) {
            return handle.getCookie(name, context);
        },

        /**
         * 设置cookie
         * @param name
         * @param option
         */
        setData: function (name, value, options, context) {

            /**
             * 获取cookie
             * @param name 名字
             * @param value 值
             * @param expires 过期时间
             * @param path 作用路径
             * @param domain 作用域
             * @param secure 安全性
             * @param response 上下文
             */
            handle.setCookie(name, value, options, context);

        },

        /**
         * 移除cookie
         * @param name
         */
        remove: function (name, context) {
            handle.removeCookie(name, context);
        }

    };

});