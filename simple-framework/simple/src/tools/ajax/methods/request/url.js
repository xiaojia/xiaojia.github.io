/*
 * url
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/request/url'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    /**
     * 重写url地址
     * @example host://get/${id} => http://get/1
     */
    var urlRewrite = function (options) {

        if (options.rewriter) {

            var reg;
            var url = options.url;
            var params = options.params;

            for (var e in params) {
                reg = new RegExp('\\$\\{' + e + '\\}', 'ig');
                if (reg.test(url)) {
                    options.url = options.url.replace(reg, params[e]);
                    delete params[e];
                }
            }

        }

    };

    /**
     * 协议替换成真实的url地址
     * @example host://get => http://xxx.com/get
     */
    var protocolReplace = function (url) {
        if (url.indexOf('://') > -1) {
            var host = Simple.Store.getHosts() || {};
            return url.replace(/(^\w+):\/\//ig, function (r, r1) {
                return host[r1] || r;
            });
        } else {
            return url;
        }
    };

    /**
     * url参数排序, 保证缓存不会重复
     * @param url
     */
    var paramSort = function (url, traditional) {

        var queIndex = null;

        /**
         * 如果有参数
         */
        if ((queIndex = url.indexOf('?')) > -1) {

            var param = url.substring(queIndex + 1);
            var paramObj = utils.split(param, '&', '=', true);

            /**
             * 取出对象的key, 并且排序
             */
            var sortParam = utils.object(utils.sortBy(utils.pairs(paramObj)));

            /**
             * 返回排序后的数据
             */
            return url.replace(/\?.*$/ig, '?' + utils.param(sortParam, traditional));

        }

        return url;

    };

    module.exports = function (options) {

        /**
         * 去除hash, 如果有的话
         * @type {string|XML}
         */
        options.url = options.url.replace(/#.*$/ig, '');

        /**
         * 重写url地址
         * @example host://get/${id} => http://get/1
         */
        urlRewrite(options);

        /**
         * 协议替换成真实的url地址
         * @example host://get => http://xxx.com/get
         */
        options.url = protocolReplace(options.url);

        /**
         * 格式化数据, object to string
         */
        if (typeof options.params !== 'string' && options.processData) {
            options.params = utils.param(options.params, options.traditional);
        }

        /**
         * 如果是GET，则合并数据
         */
        if (options.method === 'GET' && options.params && options.processData) {
            options.url += (options.url.indexOf('?') > -1 ? '&' : '?') + options.params;
            options.params = null;
        }

        /**
         * url参数排序
         */
        options.url = paramSort(options.url, options.traditional);

    };

});