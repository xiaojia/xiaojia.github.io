/*
 * main
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-template/dom'
}, function (require, module, exports, Simple) {

    "use strict";

    /**
     * html字符串转DOM对象
     * @param html
     * @returns {Element|*}
     */
    module.exports = function (html) {

        var root, div, DOM;

        div = document.createElement('div');
        div.innerHTML = html;

        /**
         * IE7下图片如果没有放入到 BODY 则 width, height 为 0
         */
        if (Simple.platform.ie && Simple.platform.ie < 8) {
            div.style.cssText = "position:absolute;left:-999999px;top:-999999px;visibility:hidden;";
            document.body.appendChild(div);
        }

        root = (div.childNodes.length === 1)
            ? div.childNodes[0].cloneNode(true)
            : div;

        DOM = root;

        /**
         * IE7下图片如果没有放入到 BODY 则 width, height 为 0
         */
        if (Simple.platform.ie && Simple.platform.ie < 8) {
            if (div.childNodes.length !== 1) {
                root.style.cssText = '';
            }
            document.body.removeChild(div);
        }

        root = null;
        div = null;

        return DOM

    };

});