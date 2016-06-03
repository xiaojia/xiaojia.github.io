/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:component/utils'
}, function (require, module, exports, Simple) {

    "use strict";

    var comID = Simple.Module.config.comID;
    var idPrefix = Simple.Module.config.idPrefix;

    var STATUS = {
        INITIALIZE: 'initialize',
        RENDER: 'render'
    };

    /**
     * 实例化页面需要的组件
     * @param that component对象
     */
    var createComponent = function (that) {

        var componentItem;
        var com = that.component;
        var component = {};

        for (var e in com) {
            componentItem = component[e];
            if (!(componentItem instanceof Simple.Object)) {
                component[e] = com[e].create({
                    app: that.app,
                    id: idPrefix + that.app.componentCount++
                });
            }
        }

        that.instantiateComponent = component;

    };

    /**
     * 返回DOM下所有带ref属性的Node
     * @param {Document} DOM DOM节点
     * @param refs
     * @returns {Object} 返回一组DOM节点
     */
    var parseDOMref = function (DOM, refs) {

        var nodes, nodeItem, ref;
        var selfRef = DOM.getAttribute('ref');

        if (selfRef) {
            refs[selfRef] = DOM;
        }

        nodes = DOM.children;

        for (var i = 0, len = nodes.length; i < len; i++) {

            nodeItem = nodes[i];
            ref = nodeItem.getAttribute('ref');

            if (ref) {
                if (refs[ref]) {
                    if (refs[ref] instanceof Array) {
                        refs[ref].push(nodeItem);
                    } else {
                        refs[ref] = [refs[ref], nodeItem];
                    }
                } else {
                    refs[ref] = nodeItem;
                }
            }

            if (!nodeItem.getAttribute(comID)) {
                parseDOMref(nodeItem, refs);
            }

        }

        return refs;

    };

    module.exports = {
        createComponent: createComponent,
        parseDOMref: parseDOMref,
        STATUS: STATUS
    }

});