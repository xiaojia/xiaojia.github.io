/*
 * utils
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-template/utils'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = {};

    if (Simple.platform.browser) {

        var nextTick = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        if (nextTick) {
            utils.nextTick = function () {
                nextTick.apply(window, arguments);
            }
        } else {
            utils.nextTick = function (func) {
                setTimeout(func, 0);
            }
        }

    }

    module.exports = utils;

});