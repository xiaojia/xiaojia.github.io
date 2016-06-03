/*
 * diff
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-dom/diff/main',
    require: [
        '../utils/main',
        '../patch/main',
        '../diff/list'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = require('../utils/main');
    var patch = require('../patch/main');
    var listDiff = require('../diff/list').diff;

    var diff = function (oldDOM, newDOM) {
        var patches = {};
        dfsWalk(oldDOM, newDOM, 0, patches);
        return patches;
    };

    /**
     * 判断是否是同元素
     * @param oldDOM
     * @param newDOM
     * @returns {boolean}
     */
    var compareNode = function (oldDOM, newDOM) {
        return (oldDOM.tagName === newDOM.tagName && utils.getItemKey(oldDOM) === utils.getItemKey(newDOM));
    };

    /**
     * diff开始
     * @param oldDOM
     * @param newDOM
     * @param index
     * @param patches
     * @returns {Array}
     */
    var dfsWalk = function (oldDOM, newDOM, index, patches) {

        var currentPatch = [];

        if (newDOM) {

            var oldDOMType = oldDOM.nodeType;
            var newDOMType = newDOM.nodeType;

            /**
             * 如果是text
             */
            if (oldDOMType === 3 && newDOMType === 3) {
                var oldDOMValue = oldDOM.nodeValue || oldDOM.textContent;
                var newDOMValue = newDOM.nodeValue || newDOM.textContent;
                if (oldDOMValue !== newDOMValue) {
                    currentPatch.push({
                        type: patch.TEXT,
                        content: newDOMValue
                    });
                }
            } else {

                /**
                 * 是否是同一个组件
                 * 标签是否相同
                 * key是否相同
                 */
                if (compareNode(oldDOM, newDOM)) {

                    var oldDOMKey = utils.getItemKey(oldDOM) || 1;
                    var newDOMKey = utils.getItemKey(newDOM) || 2;

                    /**
                     * DIFF子元素
                     */
                    if (!index || oldDOMKey !== newDOMKey) {

                        /**
                         * 判断属性
                         * @type {*}
                         */
                        var patchAttribute = diffAttribute(oldDOM, newDOM);
                        if (patchAttribute) {
                            currentPatch.push({
                                type: patch.PROPS,
                                props: patchAttribute
                            });
                        }

                        diffChildren(utils.getChildren(oldDOM), utils.getChildren(newDOM), index, patches, currentPatch);

                    }

                } else {

                    /**
                     * 做替换操作
                     */
                    currentPatch.push({
                        type: patch.REPLACE,
                        node: newDOM
                    });

                }

            }

        }

        oldDOM = null;
        newDOM = null;

        if (currentPatch.length) {
            return patches[index] = currentPatch;
        }

    };

    /**
     * diff子元素, 进行排序, 删除, 添加操作
     * @param oldChildren
     * @param newChildren
     * @param index
     * @param patches
     * @param currentPatch
     */
    var diffChildren = function (oldChildren, newChildren, index, patches, currentPatch) {

        var diffs = listDiff(oldChildren, newChildren);
        newChildren = diffs.children;

        if (diffs.moves.length) {
            var reorderPatch = {
                type: patch.REORDER,
                moves: diffs.moves
            };
            currentPatch.push(reorderPatch);
        }

        var count = 0;
        var leftNode = null;
        var currentNodeIndex = index;
        var child;

        for (var i = 0, len = oldChildren.length; i < len; i++) {

            child = oldChildren[i];

            var newChild = newChildren[i];

            if (leftNode && (count = getNodesLength(leftNode))) {
                currentNodeIndex += count + 1
            } else {
                currentNodeIndex += 1;
            }

            dfsWalk(child, newChild, currentNodeIndex, patches);

            leftNode = child;

        }

    };

    /**
     * diff 属性
     * @param oldDOM
     * @param newDOM
     * @returns {*}
     */
    var diffAttribute = function (oldDOM, newDOM) {

        var oldAttributes = attributeToObject(oldDOM);
        var newAttributes = attributeToObject(newDOM);

        var key, value;
        var count = 0;
        var propsPatches = {};

        for (key in oldAttributes) {
            value = oldAttributes[key];
            if (newAttributes[key] !== value) {
                count++;
                propsPatches[key] = newAttributes[key];
            }
        }

        for (key in newAttributes) {
            value = newAttributes[key];
            if (!oldAttributes.hasOwnProperty(key)) {
                count++;
                propsPatches[key] = newAttributes[key];
            }
        }

        if (count === 0) {
            return null;
        }

        return propsPatches;

    };

    /**
     * 获取节点下所有节点的count
     * @param nodes
     * @returns {number}
     */
    var getNodesLength = function (nodes) {
        var count = 0;
        var childNodes = utils.getChildren(nodes);
        for (var i = 0, len = childNodes.length; i < len; i++) {
            count++;
            count += getNodesLength(childNodes[i]);
        }
        return count;
    };

    /**
     * 节点 attributes 转 object
     * @param dom
     * @returns {{}}
     */
    var attributeToObject = function (dom) {

        var attr = dom.attributes;
        var props = {}, name;

        var removeAttrs = ['complete', 'SimpleEvents'];

        for (var i = 0, len = attr.length; i < len; i++) {
            name = attr[i].name;
            if (attr[i].specified && removeAttrs.indexOf(name) === -1) {
                props[attr[i].name] = attr[i].value;
            }
        }

        if (dom.style.cssText) {
            props.style = dom.style.cssText;
        }

        dom = null;

        return props;

    };

    module.exports = diff;

});