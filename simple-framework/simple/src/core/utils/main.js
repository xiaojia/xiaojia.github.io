/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/utils/main',
    require: [
        './underscore',
        './clone',
        './extend',
        './split'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var underscore = require('./underscore');

    underscore.clone = require('./clone');
    underscore.extend = require('./extend');
    underscore.split = require('./split');

    module.exports = underscore;

});