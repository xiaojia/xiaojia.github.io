/*
 * request
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/methods/get',
    require: [
        './request'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var request = require('./request');

    /**
     * get请求
     * @param url
     * @param params
     * @param dataType
     * @returns {*}
     */
    module.exports = function (url, params, dataType) {

        return request(url, {
            method: 'GET',
            params: params || {},
            dataType: dataType || 'JSON'
        });

    };

});