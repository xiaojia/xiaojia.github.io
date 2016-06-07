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
        './split',
        './param',
        './each'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var underscore = require('./underscore');

    /**
     * underscore
     * @type {_|exports|module.exports}
     */
    module.exports = underscore;

    /**
     * 重写clone, 内部判断数组或者对象
     * @type {*|exports|module.exports}
     */
    underscore.clone = require('./clone');

    /**
     * extend, 移植jquery.extend
     * @type {*|exports|module.exports}
     */
    underscore.extend = require('./extend');

    /**
     * 字符串分割
     * @type {*|exports|module.exports}
     */
    underscore.split = require('./split');

    /**
     * decodeURIComponent
     */
    underscore.decodeURIComponent = decodeURIComponent;

    /**
     * encodeURIComponent
     */
    underscore.encodeURIComponent = encodeURIComponent;

    /**
     * 重写each forEach
     * @type {underscore.forEach}
     */
    underscore.each = underscore.forEach = require('./each');

    /**
     * 对象转url参数, 移植jquery.param
     * @type {*|exports|module.exports}
     */
    underscore.param = require('./param');

});