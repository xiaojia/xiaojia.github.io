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

    module.exports = function (options) {

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

    };

});