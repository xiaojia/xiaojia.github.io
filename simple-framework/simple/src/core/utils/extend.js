/*
 * extend
 *
 * name: xiaojia
 * date: 2013/9/11
 */

Simple.Module({
    name: 'simple:core/utils/extend'
}, function (require, module, exports, Simple) {

    "use strict";

    var Extend = {

        /**
         * 重写extend方法, 方法来自jquery
         * @returns {*|{}}
         */
        "extend": function () {

            var src, copyIsArray, copy, name, options, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            if (typeof target === "boolean") {
                deep = target;
                target = arguments[i] || {};
                i++;
            }

            if (typeof target !== "object" && !this.isFunction(target)) {
                target = {};
            }

            for (; i < length; i++) {

                if ((options = arguments[i]) != null) {

                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        if (target === copy) {
                            continue;
                        }

                        if (deep && copy && ( this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)) )) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && this.isArray(src) ? src : [];

                            } else {
                                clone = src && this.isPlainObject(src) ? src : {};
                            }

                            target[name] = this.extend(deep, clone, copy);

                        } else if (copy !== void 0) {
                            target[name] = copy;
                        }
                    }
                }
            }

            return target;

        },

        "isFunction": function (obj) {
            return this.type(obj) === "function";
        },

        "isArray": Array.isArray || function (obj) {
            return this.type(obj) === "array";
        },

        "isNumeric": function (obj) {
            return !this.isArray(obj) && obj - parseFloat(obj) >= 0;
        },

        "isPlainObject": function (obj) {

            var key;

            if (!obj || this.type(obj) !== "object") {
                return false;
            }

            try {
                if (obj.constructor && !this.hasOwn.call(obj, "constructor") && !this.hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            return key === void 0 || this.hasOwn.call(obj, key);

        },

        "hasOwn": ({}).hasOwnProperty,

        "type": function (obj) {
            var s = Object.prototype.toString.call(obj);
            return s.substr(8, s.length - 9).toLowerCase();
        }

    };

    module.exports = function () {
        return Extend.extend.apply(Extend, arguments);
    }

});