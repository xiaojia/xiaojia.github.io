/*
 * low
 *
 * name: xiaojia
 * date: 16/4/22
 */

!function () {

    /**
     * 扩展Function.bing
     */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }

    /**
     * 扩展Object.keys
     */
    if (!Object.keys) {

        var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
            hasOwn = ({}).hasOwnProperty;

        for (var i in {
            toString: 1
        }) {
            DONT_ENUM = false;
        }

        Object.keys = Object.keys || function (obj) {//ecma262v5 15.2.3.14
                var result = [];
                for (var key in obj) if (hasOwn.call(obj, key)) {
                    result.push(key);
                }
                if (DONT_ENUM && obj) {
                    for (var i = 0; key = DONT_ENUM[i++];) {
                        if (hasOwn.call(obj, key)) {
                            result.push(key);
                        }
                    }
                }
                return result;
            };

    }

    /**
     * 扩展String.trim
     */
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            if (jQuery) {
                return jQuery.trim(this);
            } else {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }
    }

    /**
     * 扩展Array.indexOf
     */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (val) {
            var value = this;
            for (var i = 0; i < value.length; i++) {
                if (value[i] == val) return i;
            }
            return -1;
        };
    }

    /**
     * 扩展Array.forEach
     */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun, array) {
            array || (array = this);
            for (var i = 0; i < array.length; i++) {
                fun(array[i], i, array);
            }
        };
    }

    /**
     * 扩展Date.now
     */
    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    /**
     * 扩展localStorage
     */
    if (!window.localStorage) {
        (function () {
            var localStorageData = {};
            window.localStorage = {
                setItem: function (key, value) {
                    localStorageData[key] = value;
                },
                getItem: function (key) {
                    return localStorageData[key];
                },
                removeItem: function (key) {
                    delete localStorageData[key];
                }
            }
        })();
    }

    /**
     * 扩展document.head
     */
    if (!document.head) {
        document.head = document.getElementsByTagName('head')[0];
    }

    /**
     * IE不支持自定义标签, 需要实现创建
     */
    document.createElement('simple-component');

}();