/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/callbacks/main',
    require: [
        './core'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    module.exports = require('./core');

});