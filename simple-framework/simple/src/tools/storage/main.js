/*
 * main
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:tools/storage/main',
    require: [
        './data/memory'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var dataMemory = require('./data/memory');

    /**
     * storage
     * @type {*|{}|void}
     */
    module.exports = {

        /**
         * 获取数据
         * @param key
         * @returns {*}
         */
        getData: function (key) {
            return dataMemory.getData(key);
        },

        /**
         * 设置数据
         * @param key
         * @param value
         * @param timeout
         * @returns {exports}
         */
        setData: function (key, value, timeout) {
            dataMemory.setData(key, value, timeout);
            return this;
        },

        /**
         * 移除数据
         * @param key
         * @returns {exports}
         */
        remove: function (key) {
            dataMemory.remove(key);
            return this;
        }

    };

});