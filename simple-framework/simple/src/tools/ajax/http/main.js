/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/http/main',
    require: [
        './client/main',
        './client/jsonp'
    ]
}, function (require, module, exports, Simple) {

    var client = require('./client/main');
    var jsonpHandle = require('./client/jsonp');

    module.exports = function (options) {

        /**
         * 如果是 node 则用 node http 请求数据
         */
        if (Simple.platform.node) {

            /**
             * node http
             */
            options.xhr = Simple.Server.Tools.http;

            /**
             * node 端没有 jsonp 格式
             */
            if (options.dataType === 'JSONP') {
                options.dataType = 'JSON';
            }

        } else {

            /**
             * jsonp
             */
            if (Simple.platform.browser) {
                if (options.dataType === 'JSONP') {
                    options.xhr = jsonpHandle;
                }
            }

        }

        return client(options);

    };

});