/*
 * simple-core
 *
 * name: xiaojia
 * date: 16/3/22
 */

!function () {

    "use strict";

    /**
     * 是否是开发模式
     */
    if (Simple.develop === void 0) {
        Simple.develop = true;
    }

    /**
     * 模块加载超时时间
     */
    if (Simple.config.timeout) {
        Simple.Module.setTimeout(Simple.config.timeout);
    }

    /**
     * 基本配置
     * @type {{comID: string, listKey: string, idPrefix: string}}
     */
    Simple.Module.config = {
        comID: 'data-sp',
        listKey: 'key',
        idPrefix: 's'
    };

    /**
     * 框架基础文件
     * @type {string[]}
     */
    var require = [

        './core/object/main',

        './core/message/main',
        './core/deferred/main',
        './core/callbacks/main',

        './core/view/main',
        './core/template/main',
        './core/utils/main',

        './application/main',
        './component/main',
        './router/main',
        './store/main',

        './tools/ajax/main',
        './tools/cookie/main',
        './tools/storage/main'

    ];

    /**
     * 设置项目入口
     */
    if (Simple.config.name) {
        require.push(Simple.config.name + ':router/main');
    }

    /**
     * 加载入口
     */
    Simple.Module({
        name: 'simple',
        require: require,
        root: true
    }, function (require, module, exports, Simple) {

        /**
         * 基础方法
         * @type {underscore|exports|module.exports}
         */
        Simple.Utils = require('./core/utils/main');

        /**
         * 基类
         * @type {*|exports|module.exports}
         */
        Simple.Object = require('./core/object/main');

        /**
         * view类
         * @type {*|exports|module.exports}
         */
        Simple.View = require('./core/view/main');

        /**
         * 全局消息
         * @type {*|Object|makeClass|exports|module.exports}
         */
        Simple.Message = require('./core/message/main');

        /**
         * deferred基于callbacks
         * @type {*|exports|module.exports}
         */
        Simple.Callbacks = require('./core/callbacks/main');

        /**
         * deferred jquery.deferred的移植
         * @type {*|exports|module.exports}
         */
        Simple.Deferred = require('./core/deferred/main');

        /**
         * 工具
         * @type {{ajax: (*|*|exports|module.exports|exports|module.exports), cookie: (*|exports|module.exports), storage: (*|{}|void|exports|module.exports)}}
         */
        Simple.Tools = {

            /**
             * 浏览器端利用 XmlHttpRequest, node端利用 http
             */
            ajax: require('./tools/ajax/main'),

            /**
             * cookie操作类
             */
            cookie: require('./tools/cookie/main'),

            /**
             * 缓存类, 目前只支持内存缓存
             */
            storage: require('./tools/storage/main')

        };

        /**
         * 组件类, Simple.Component.extend();
         * @type {*|exports|module.exports}
         */
        Simple.Component = require('./component/main');

        /**
         * 路由类, Simple.Router.use(), Simple.Router.go, Simple.Router.parse;
         */
        Simple.Router = require('./router/main').route;

        /**
         * 数据层方法
         * @type {*|exports|module.exports}
         */
        Simple.Store = require('./store/main');

        /**
         * 应用入口
         * @type {*|exports|module.exports}
         */
        Simple.Application = require('./application/main');

        /**
         * 模版, 虚拟DOM
         * @type {*|exports|module.exports}
         */
        Simple.Template = require('./core/template/main');

        /**
         * 加载路由配置文件
         */
        if (Simple.config.name) {
            require(Simple.config.name + ':router/main');
        }

        /**
         * 加载回调
         */
        if (Simple.ready && typeof Simple.ready === 'function') {
            Simple.ready();
        }

        /**
         * 如果是浏览器端, 直接运行路由文件
         */
        if (Simple.platform.browser) {
            Simple.Router.go(location.href);
        }

    });

}();