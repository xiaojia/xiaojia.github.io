/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:store/paging'
}, function (require, module, exports, Simple) {

    "use strict";

    /**
     * 应用
     * @typedef {Module} Paging
     * @extend Object
     */
    module.exports = Simple.Object.extend({

        _set: function (data) {

            var that = this;

            if (data.total) {
                that.total = data.total;
                that.max = parseInt((that.total + that.limit - 1) / that.limit);
            }

            if (data.page) {
                that.page = data.page;
            }

            if (data.limit) {
                that.limit = data.limit;
            }

        },

        /**
         * 上一页
         * @param params
         * @returns {*|exports}
         */
        next: function (params) {
            return this.to(this.page + 1, params);
        },

        /**
         * 下一页
         * @param params
         * @returns {*|exports}
         */
        prev: function (params) {
            return this.to(this.page - 1, params);
        },

        /**
         * 第一页
         * @param params
         * @returns {*|exports}
         */
        first: function (params) {
            return this.to(this.min, params);
        },

        /**
         * 最后一页
         * @param params
         * @returns {*|exports}
         */
        last: function (params) {
            return this.to(this.max, params);
        },

        /**
         * 到 N 页, 并且请求
         * @param page 页码
         * @param params request参数
         * @returns {exports}
         */
        to: function (page, params) {

            var that = this;

            if (typeof page !== 'undefined') {

                page = parseInt(page);

                that.page = page;

                /**
                 * 分页不能小于最小页码
                 */
                if (typeof that.min !== 'undefined' && that.page < that.min) {
                    that.page = that.min;
                }

                /**
                 * 分页不能大于最大页码
                 */
                if (typeof that.max !== 'undefined' && that.page > that.max) {
                    that.page = that.max;
                }

                that.request(params);

            }

            return that;

        }

    });

    module.exports.setName(module.id);

});