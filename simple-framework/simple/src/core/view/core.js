/*
 * core
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/view/core'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    /**
     * 组件ID
     * @type {string}
     */
    var comID = Simple.Module.config.comID;

    /**
     * 转义字符
     * @type {{<: string, >: string, ": string, ': string, &: string}}
     */
    var escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };

    var escapeFn = function (s) {
        return escapeMap[s];
    };

    /**
     * 转义HTML
     * @param content
     * @returns {string|XML|void|*}
     */
    var escapeHTML = function (content) {
        return toString(content)
            .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    };

    /**
     * 转成字符串
     * @param value
     * @param type
     * @returns {*}
     */
    var toString = function (value, type) {
        if (typeof value !== 'string') {
            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') {
                value = toString(value.call(value));
            } else {
                value = '';
            }
        }
        return value;
    };

    /**
     * 模块组件处理过程
     * @param args
     * @param $controller
     * @returns {*}
     */
    var componentHandle = function (args, $controller) {

        args = [].slice.apply(args);

        var name = args[0];
        var content = args.slice(1);
        var props = content.shift();
        var parentName = content.pop();
        var parent = $controller.instantiateComponent[parentName];

        if (!parent) {
            parent = $controller;
        }

        var currentCom = $controller.instantiateComponent[name];

        if (currentCom) {

            currentCom._set({
                props: props,
                content: content,
                parent: parent,
                name: name
            });

            if (Simple.platform.node) {
                return currentCom.render();
            } else {
                return '<div ' + comID + '="' + currentCom.id + '">' + content.join('') + '</div>';
            }

        } else {
            throw new TypeError('component render error \nname: ' + name);
        }

    };

    /**
     * 模版辅助方法
     * @type {{utils: *, console: (*|Console)}}
     */
    var helpers = {
        utils: Simple.Utils,
        console: console
    };

    module.exports = {
        $helpers: helpers,
        $string: toString,
        $escape: escapeHTML,
        $component: componentHandle,
        $each: utils.each
    }

});