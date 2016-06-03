/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:store/request'
}, function (require, module, exports, Simple) {

    "use strict";

    var request = Simple.Tools.ajax;
    var deferred = Simple.Deferred;
    var utils = Simple.Utils;

    /**
     * ajax请求数据
     * @param that 上下文
     * @param dtd deferred
     * @param params 参数
     */
    var online = function (that, dtd, params) {

        var onlineDtd = deferred();

        if (that.url) {

            /**
             * 请求数据
             */
            that.ajax = request(that.url, utils.extend({}, that.ajaxOptions, {
                method: that.method,
                cache: that.cache,
                timeout: that.timeout,
                dataType: that.dataType,
                params: params
            }));

            /**
             * 回调
             */
            that.ajax.done(function (data, response) {

                var formatData = format(that, onlineDtd, params, data, response);

                if (formatData !== false) {
                    onlineDtd.resolve(data, response);
                }

            }).fail(function (errorCode, errorText, response) {

                var formatData = format(that, onlineDtd, params, null, response);

                if (formatData !== false) {
                    onlineDtd.reject(errorCode, errorText, response);
                }

            });

        } else {
            throw 'store 没有找到 url';
        }

        /**
         * 回调
         */
        onlineDtd.then(function (data, response) {
            that.data = data;
            that.response = response;
            dtd.resolve(data, response);
        }, function (errorCode, errorText, response) {
            that.data = null;
            that.response = response;
            dtd.reject(errorCode, errorText, response);
        });

    };

    /**
     * 内联数据处理
     * @param that 上下文
     * @param dtd deferred
     * @param params 参数
     */
    var inline = function (that, dtd, params) {

        var formatData = format(that, dtd, params, that.data);

        if (formatData !== false) {
            dtd.resolve(formatData, 'success');
        }

    };

    /**
     * 格式化返回的数据
     * @param that 上下文
     * @param dtd deferred
     * @param params 参数
     * @param data 返回的数据
     * @param response ajax对象
     * @returns {*}
     */
    var format = function (that, dtd, params, data, response) {

        var formatData;

        if (that.format && (formatData = that.format(dtd, params, data, response)) === false) {
        } else {
            formatData = data;
        }

        /**
         * 传入分页信息, total
         */
        if (that.paging && formatData.paging) {
            that.paging._set(formatData.paging);
        }

        return formatData;

    };

    /**
     * 请求
     * @param {Object|String} params 参数
     * @returns {Deferred}
     */
    module.exports = function (params) {

        var that = this;
        var dtd = deferred();
        var paging = that.paging;

        /**
         * 分页信息
         */
        if (paging) {

            var pagingParams = {};
            var pagingOptions = that.pagingOptions;

            /**
             * 分页参数映射
             * @type {*|string}
             */
            pagingParams[pagingOptions.map.page] = paging.page;
            pagingParams[pagingOptions.map.limit] = paging.limit;

            /**
             * 分页参数合并
             */
            params = utils.extend({}, that.params, params, pagingParams);

        }

        /**
         * 是否已取消
         */
        if (that.isAbort) {
            dtd.reject('abort', '操作被取消');
        } else {

            switch (that.type) {
                case 'inline':
                    inline(that, dtd, params);
                    break;
                case 'online':
                    online(that, dtd, params);
                    break;
            }

        }

        return dtd.promise();

    };

});