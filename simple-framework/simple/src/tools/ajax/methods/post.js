/*
 * request
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/post',
    require: [
        './request'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var request = require('./request');

    /**
     * post请求
     * @param url
     * @param params
     * @param dataType
     * @returns {*}
     */
    module.exports = function (url, params, dataType, context) {

        return request(url, {
            method: 'POST',
            params: params || {},
            dataType: dataType || 'JSON',
            context: context || null
        });

    };

});