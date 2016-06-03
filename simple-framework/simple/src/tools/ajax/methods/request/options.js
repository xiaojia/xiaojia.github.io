/*
 * options
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/request/options'
}, function (require, module, exports, Simple) {

    "use strict";

    module.exports = {

        /**
         * 是否针对返回数据进行标准处理, false 则不做任何处理
         */
        canonical: true,

        /**
         * 是否url重写
         * @example http://xxx.com/${id}
         */
        rewriter: false,

        /**
         * 请求返回的数据格式, 进行格式户
         */
        dataType: 'JSON',

        /**
         * 请求的地址
         */
        url: './',

        /**
         * 请求类型 GET POST
         */
        method: "GET",

        /**
         * 发送到服务器的数据。将自动转换为请求字符串格式。
         * GET 请求中将附加在 URL 后。
         * 查看 processData 选项说明以禁止此自动转换。
         * 必须为 Key/Value 格式。如果为数组，将自动为不同值对应同一个名称。如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。
         */
        processData: true,

        /**
         * 是否为异步请求, 新版浏览器值只能为 true
         */
        async: true,

        /**
         * 超时时间, 默认为10秒
         */
        timeout: 10000,

        /**
         * 设置mime
         */
        mimeType: 'text/xml',

        /**
         * 默认请求头信息
         */
        headers: {
            "X-Data-Type": "json",
            "X-Requested-With": "XMLHttpRequest"
        },

        /**
         * 请求的数据
         */
        params: {},

        /**
         * 是否缓存, 如果为false则请求时默认加一个随机参数
         */
        cache: false,

        /**
         * 缓存配置, 如果 cache 为 true 则应用下面的配置
         */
        cacheSetting: {

            /**
             * 缓存时间, 默认为60秒
             */
            timeout: 60000,

            /**
             * 缓存类型, 默认为内存缓存, 现在只支持内存缓存
             */
            type: 'memory'

        },

        /**
         * jsonp 格式时,请求数据的编码
         */
        charset: 'UTF-8',

        /**
         * 如果你想要用传统的方式来序列化数据，那么就设置为 true
         */
        traditional: true,

        /**
         * 默认情况下，请求总会被发出去，但浏览器有可能从它的缓存中调取数据。
         * 要禁止使用缓存的结果，可以设置 cache 参数为 false。
         * 如果希望判断数据自从上次请求后没有更改过就报告出错的话，可以设置 ifModified 为 true
         */
        ifModified: false,

        /**
         * 设置本地XHR对象的“名-值”映射。
         * 例如，可以在需要时设置“withCredentials”为真而执行跨域名请求。
         * XHR：XMLHttpRequest (XHR) ，基于XML技术的Http请求。
         */
        xhrFields: {
            withCredentials: true
        },

        /**
         * 要求为String类型的参数，当发送信息至服务器时，内容编码类型默认为"application/x-www-form-urlencoded"。
         * 该默认值适合大多数应用场合。
         */
        contentType: "application/x-www-form-urlencoded; charset=UTF-8"

    }

});