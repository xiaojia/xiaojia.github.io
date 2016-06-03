/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/class/main'
}, function (require, module, exports, Simple) {

    "use strict";

    var W3C = !(Simple.platform.ie && Simple.platform.ie <= 8);
    var ClassNameId = 0;

    /**
     * 计算父级的构造函数
     * @param cls
     * @param count
     * @returns {exports.$constructor|i.exports.$constructor|t.exports.$constructor|*}
     */
    var getSuperConstructor = function (cls, count) {

        if (cls) {
            if (cls.$constructor && !count) {
                return cls.$constructor;
            } else {
                return getSuperConstructor(cls.__proto__, --count);
            }
        }

    };

    var makeClass = function () {

        var initProperties = {};

        /**
         * 定义
         * @constructor
         */
        var Class = function () {

            var that = this;

            for (var e in initProperties) {
                that[e] = initProperties[e];
            }

            initProperties = null;

            that.$super = function () {
                var $constructor = getSuperConstructor(W3C ? that.__proto__ : that, ++that.$super.count);
                $constructor && $constructor.call(that);
            };

            that.$super.count = 0;

            if (that.$constructor) {
                that.$constructor.apply(that, arguments);
            }

        };

        /**
         * 实例化
         * @param properties
         * @returns {makeClass}
         */
        Class.create = function (properties) {
            initProperties = properties;
            return new this();
        };

        /**
         * 继承
         * @param properties
         */
        Class.extend = function (properties) {

            var Class = makeClass();

            Class.prototype = Object.create(this.prototype);

            /**
             * ie8
             */
            if (!W3C) {
                Class.prototype.__proto__ = this.prototype;
            }

            for (var e in properties) {
                if (e === '$constructor') {
                    Class.prototype.$constructor = properties.$constructor;
                } else {
                    if (properties.hasOwnProperty(e)) {
                        Class.prototype[e] = properties[e];
                    }
                }
            }

            if (properties && properties.toString) {
                if (properties.hasOwnProperty('toString')) {
                    Class.prototype.toString = properties.toString;
                }
            }

            Class.prototype.constructor = Class;

            Class.toString = function () {
                return 'Simple.Class<' + Class.id + '>';
            };

            return Class;

        };

        /**
         * 设置类的显示名字
         * @param id
         * @returns {makeClass}
         */
        Class.setName = function (id) {
            Class.id = id.replace(/[:/]/ig, '.').replace(/\w+/ig, function (str) {
                return str.substring(0, 1).toUpperCase() + str.substring(1);
            }).replace(/-\w/ig, function (str) {
                return str.substring(1, 2).toUpperCase();
            }).replace(/\.Main$/ig, '');
            return this;
        };

        /**
         * 定义静态属性, 方法
         * @param properties
         * @returns {makeClass}
         */
        Class.reopenClass = function (properties) {
            for (var e in properties) {
                this[e] = properties[e];
            }
            return this;
        };

        /**
         * 在控制台可以显示类名
         * @returns {string}
         */
        Class.toString = function () {
            return 'Simple.Class';
        };

        return Class;

    };

    module.exports = makeClass;

});