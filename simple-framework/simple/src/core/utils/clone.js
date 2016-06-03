/*
 * clone
 *
 * name: xiaojia
 * date: 2013/9/11
 */

Simple.Module({
    name: 'simple:core/utils/clone',
    require: [
        './underscore'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var underscore = require('./underscore');

    /**
     * 重写对象克隆方法, 判断Array或者Object
     * @param value
     * @returns {*}
     */
    module.exports = function (value) {
        if (underscore.isArray(value)) {
            return underscore.extend([], value);
        } else if (underscore.isObject(value)) {
            return underscore.extend({}, value);
        } else {
            return value;
        }
    }

});