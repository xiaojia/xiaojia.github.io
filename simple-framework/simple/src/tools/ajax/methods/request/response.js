/*
 * response
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/request/response'
}, function (require, module, exports, Simple) {

    "use strict";

    /**
     * 数据解析
     * @param dtd
     * @param options
     * @param data
     * @returns {*}
     */
    var dataParse = function (dtd, options, response) {

        var data = response.text;
        var dataType = options.dataType;
        var dataParse = options.dataParse;

        if (dataParse && dataParse[dataType]) {
            return dataParse[dataType](options, data);
        } else {

            if (dataType === 'JSON' || dataType === 'JSONP') {
                if (typeof data === 'string') {
                    return JSON.parse(data.trim());
                } else {
                    return data;
                }
            } else {
                return data;
            }

        }

    };

    /**
     * 数据过滤
     * @param options
     * @param data
     * @returns {*}
     */
    var dataFilter = function (options, data) {

        var userDataFilter = options.dataFilter;

        if (userDataFilter) {
            return userDataFilter(options.dataType, options, data);
        } else {
            return data;
        }

    };

    /**
     * 成功回调
     */
    var success = function (dtd, options, response) {

        var data;

        /**
         * 数据格式化
         * @type {*}
         */
        data = dataParse(dtd, options, response);

        /**
         * 数据过滤
         * @type {*}
         */
        data = dataFilter(options, data);

        /**
         * 存入处理后的数据
         * @type {*}
         */
        response.data = data;

        /**
         * 全局处理, 如果返回 false 则不继续运行
         */
        if (!options.success || options.success(dtd, options, response) !== false) {

            /**
             * 是否走标准流程
             */
            if (options.canonical && options.dataType === 'JSON' || options.dataType === 'JSONP') {

                if (data.success) {

                    /**
                     * 成功
                     */
                    dtd.resolve(data.data, response, options.context);

                } else {

                    /**
                     * 失败
                     */
                    dtd.reject(data.errorCode, data.message, response, options.context);

                }

            } else {

                /**
                 * 直接返回数据, 不做处理
                 */
                dtd.resolve(data, response, options.context);

            }

        }

    };

    /**
     * 失败回调
     */
    var error = function (dtd, options, response) {

        /**
         * 全局处理, 如果返回 false 则不继续运行
         */
        if (!options.error || options.error(dtd, options, response) !== false) {

            /**
             * 直接返回数据, 不做处理
             */
            dtd.reject(response.statusCode, response.statusText, response, options.context);

        }

    };

    module.exports = function (dtd, options, isSuccess, response) {

        if (isSuccess) {
            success(dtd, options, response);
        } else {
            error(dtd, options, response);
        }

    };

});