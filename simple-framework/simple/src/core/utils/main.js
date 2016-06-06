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
    underscore.each = underscore.forEach = function (obj, iteratee, context) {

        var i, length;

        iteratee = iteratee.bind(context);

        if (underscore.isArray(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (iteratee(obj[i], i, obj) === false) {
                    break;
                }
            }
        } else if (underscore.isObject(obj)) {
            var keys = underscore.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                if (iteratee(obj[keys[i]], keys[i], obj) === false) {
                    break;
                }
            }
        }

        return obj;

    };

    module.exports = underscore;

});