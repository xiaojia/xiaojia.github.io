/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/object/main',
    require: [
        '../class/main',
        '../event/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var Class = require('../class/main');
    var Event = require('../event/main');

    /**
     * 所有的类都基于Object
     */
    module.exports = Class().extend({
        on: Event.on,
        off: Event.off,
        once: Event.once,
        emit: Event.trigger
    });

    module.exports.setName(module.id);

});