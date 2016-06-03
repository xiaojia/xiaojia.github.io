/*
 * main
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:core/message/main',
    require: [
        '../event/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var Event = require('../event/main');

    /**
     * 全局消息系统
     * @type {*|Object|makeClass}
     */
    module.exports = Simple.Object.create({
        on: Event.on,
        off: Event.off,
        once: Event.once,
        emit: Event.trigger
    });

});