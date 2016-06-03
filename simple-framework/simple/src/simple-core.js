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

        Simple.Utils = require('./core/utils/main');

        Simple.Object = require('./core/object/main');
        Simple.View = require('./core/view/main');

        Simple.Message = require('./core/message/main');
        Simple.Callbacks = require('./core/callbacks/main');
        Simple.Deferred = require('./core/deferred/main');

        Simple.Tools = {
            ajax: require('./tools/ajax/main'),
            cookie: require('./tools/cookie/main'),
            storage: require('./tools/storage/main')
        };

        Simple.Component = require('./component/main');
        Simple.Router = require('./router/main').route;
        Simple.Store = require('./store/main');

        Simple.Application = require('./application/main');

        Simple.Template = require('./core/template/main');

        if (Simple.config.name) {
            require(Simple.config.name + ':router/main');
        }

        if (Simple.platform.browser) {
            Simple.Router.go(location.href);
        }

    });

}();