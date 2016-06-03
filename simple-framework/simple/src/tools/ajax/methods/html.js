/*
 * request
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/html',
    require: [
        './request'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var request = require('./request');

    /**
     * html请求
     * @param url
     * @param params
     * @param dataType
     * @returns {*}
     */
    module.exports = function (url, params, method) {

        return request(url, {
            method: method || 'GET',
            params: params,
            dataType: 'HTML'
        });

    };

});