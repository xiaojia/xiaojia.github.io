/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:store/main',
    require: [
        './request',
        './paging'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var paging = require('./paging');

    /**
     * 应用
     * @typedef {Module} Store
     * @extend Object
     */
    module.exports = Simple.Object.extend({

        $constructor: function () {

            var that = this;

            if (that.paging) {

                var pagingOptions = that.pagingOptions;

                /**
                 * 实例化分页
                 */
                that.paging = paging.create({
                    request: that.request.bind(that),
                    limit: pagingOptions.limit,
                    page: pagingOptions.page,
                    min: pagingOptions.min
                });

            }

        },

        /**
         * 是否缓存
         */
        cache: false,

        /**
         * 数据类型, online, inline
         */
        type: 'online',

        /**
         * 参数
         */
        params: {},

        /**
         * 如果 type === 'inline'; 或者为默认数据
         */
        data: null,

        /**
         * ajax返回数据类型
         */
        dataType: 'json',

        /**
         * 数据返回之前的格式化, 支持异步
         * @returns {Deferred}
         */
        format: null,

        /**
         * ajax配置
         */
        ajaxOptions: null,

        /**
         * 是否启动分页
         */
        paging: false,

        /**
         * 超时时间
         */
        timeout: 10000,

        /**
         * 分页配置
         */
        pagingOptions: {

            /**
             * 数据字段映射
             */
            map: {
                limit: 'limit',
                page: 'page'
            },

            /**
             * 每页的数据量
             */
            limit: 20,

            /**
             * 起始页码
             */
            page: 1,

            /**
             * 最小页码
             */
            min: 1

        },

        /**
         * 请求类型
         */
        method: 'get',

        /**
         * 请求
         */
        request: require('./request'),

        /**
         * 取消请求
         */
        abort: function () {

            var that = this;

            that.isAbort = true;

            if (that.ajax) {
                that.ajax.abort();
            }

        }

    });

    module.exports.reopenClass({

        /**
         * 全局协议地址
         */
        _hosts: {},

        /**
         * 设置hosts
         * @param key
         * @param value
         */
        setHosts: function (key, value) {
            if (typeof key === 'object') {
                this._hosts = key;
            } else {
                this._hosts[key] = value;
            }
        },

        /**
         * 获取hosts
         * @param key
         * @returns {*}
         */
        getHosts: function (key) {
            if (typeof key === 'undefined') {
                return this._hosts;
            } else {
                return this._hosts[key];
            }
        }

    });

    module.exports.setName(module.id);

});