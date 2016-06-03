/*
 * memory
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:tools/storage/data/memory'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    /**
     * 数据缓存
     * @type {{}}
     */
    var cacheObject = {};

    /**
     * 移除数据定时器
     * @type {{}}
     */
    var removeTimer = {};

    module.exports = {

        /**
         * 获取数据
         * @param key
         */
        getData: function (key) {
            if (key) {
                return cacheObject[key] || null;
            } else {
                return utils.extend({}, cacheObject);
            }
        },

        /**
         * 存储数据
         * @param key 标识
         * @param value 值
         * @param timeout 超时时间
         */
        setData: function (key, value, timeout) {

            timeout || (timeout = 60000);
            cacheObject[key] = value;

            /**
             * 数据超时
             * @type {*}
             */
            var timer = removeTimer[timeout];

            /**
             * 如果有相同超时时间的列队则插入到列队
             */
            if (timer) {
                removeTimer[timeout].keys.push(key);
            } else {

                /**
                 * 如果没有则创建倒计时
                 * @type {{timer: number, keys: *[]}}
                 */
                removeTimer[timeout] = {

                    /**
                     * 倒计时
                     */
                    timer: setTimeout(function (timeout) {

                        var keys = removeTimer[timeout].keys;

                        /**
                         * 移除所有数据
                         */
                        for (var i = 0, len = keys.length; i < len; i++) {
                            delete cacheObject[keys[i]];
                        }

                        /**
                         * 移除倒计时
                         */
                        delete removeTimer[timeout];

                    }.bind(this, timeout), timeout),

                    /**
                     * 列队
                     */
                    keys: [key]

                };

            }

        },

        /**
         * 移除数据
         * @param key
         */
        remove: function (key) {
            delete cacheObject[key];
        }

    };

});