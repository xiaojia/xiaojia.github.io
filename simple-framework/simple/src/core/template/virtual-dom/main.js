/*
 * main
 *
 * name: xiaojia
 * date: 16/3/23
*/

Simple.Module({
    name: 'simple:core/template/virtual-dom/main',
    require: [
        './diff/main',
        './patch/main'
    ]
}, function (require, module, exports) {

    "use strict";

    module.exports = {
        diff: require('./diff/main'),
        patch: require('./patch/main')
    };

});