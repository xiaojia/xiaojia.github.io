/*
 * param
 *
 * name: xiaojia
 * date: 16/6/7
 */

Simple.Module({
    name: 'simple:core/utils/each',
    require: [
        './underscore'
    ]
}, function (require, module, exports, Simple) {

    var utils = require('./underscore');

    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    /**
     * Helper for collection methods to determine whether a collection
     * should be iterated as an array or as an object
     * Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
     * Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
     * @type {number}
     */
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    /**
     * 重写each方法
     * @param obj
     * @param iteratee
     * @param context
     * @returns {*}
     */
    module.exports = function (obj, iteratee, context) {
        var i, length;
        iteratee = iteratee.bind(context);
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (iteratee(obj[i], i, obj) === false) {
                    break;
                }
            }
        } else {
            var keys = utils.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                if (iteratee(obj[keys[i]], keys[i], obj) === false) {
                    break;
                }
            }
        }
        return obj;
    };

});