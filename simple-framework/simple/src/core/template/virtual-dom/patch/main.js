/*
 * patch
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-dom/patch/main',
    require: [
        '../utils/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var comID = Simple.Module.config.comID;
    var utils = require('../utils/main');

    var REPLACE = 'replace';
    var REORDER = 'reorder';
    var PROPS = 'props';
    var TEXT = 'text';
    var REMOVE = 'remove';
    var INSERT = 'insert';

    var patch = function (node, patches) {
        var walker = {index: 0, newNode: null, oldNode: node, remove: [], create: []};
        dfsWalk(node, walker, patches);
        return walker;
    };

    /**
     * 找到需要修改的DOM元素和修改内容
     * @param node
     * @param walker
     * @param patches
     */
    var dfsWalk = function (node, walker, patches) {

        var child;
        var currentPatches = patches[walker.index];

        var childNodes = utils.getChildren(node);
        var len = childNodes ? childNodes.length : 0;

        for (var i = 0; i < len; i++) {
            child = childNodes[i];
            walker.index++;
            if (child) {
                switch (child.nodeType) {
                    case 8:
                        break;
                    default:
                        dfsWalk(child, walker, patches);
                }
            }
        }

        if (currentPatches) {
            applyPatches(node, currentPatches, walker);
        }

    };

    /**
     * 针对DOM做对应的修改
     * @param node
     * @param currentPatches
     * @param walker
     */
    var applyPatches = function (node, currentPatches, walker) {

        var currentPatch;

        for (var i = 0, len = currentPatches.length; i < len; i++) {

            currentPatch = currentPatches[i];

            switch (currentPatch.type) {

                case REPLACE:

                    var newNode = currentPatch.node;
                    var replaceChild = newNode.cloneNode(true);

                    node.parentNode.replaceChild(replaceChild, node);
                    componentHandle(replaceChild, node, walker);

                    if (walker.oldNode === node) {
                        walker.newNode = replaceChild;
                    }

                    replaceChild = null;

                    break;

                case REORDER:
                    reorderChildren(node, currentPatch.moves, walker);
                    break;

                case PROPS:
                    setProps(node, currentPatch.props);
                    break;

                case TEXT:
                    if (node.nodeValue) {
                        node.nodeValue = currentPatch.content;
                    } else {
                        node.textContent = currentPatch.content;
                    }
                    break;

                default:
                    throw new Error('Unknown patch type ' + currentPatch.type);

            }

        }

    };

    /**
     * 获取dom下的所有component
     * @param dom
     * @returns {Array}
     */
    var getComponent = function (dom) {

        var children = [], child, key;
        var domChildren = dom.children;

        for (var i = 0, len = domChildren.length; i < len; i++) {
            child = domChildren[i];
            if (key = child.getAttribute(comID)) {
                children.push(key);
            } else {
                children = children.concat(getComponent(child));
            }
        }

        return children;

    };

    /**
     * 是否对组件进行操作
     * @param create
     * @param remove
     * @param walker
     */
    var componentHandle = function (create, remove, walker) {

        var key;

        if (create && create.nodeType === 1) {
            if (key = utils.getItemKey(create)) {
                walker.create.push(key);
            } else {
                walker.create = walker.create.concat(getComponent(create));
            }
        }

        if (remove && remove.nodeType === 1) {
            if (key = utils.getItemKey(remove)) {
                walker.remove.push(key);
            } else {
                walker.remove = walker.remove.concat(getComponent(remove));
            }
        }

    };

    /**
     * 设置属性, 如果为 undefined 则移除属性
     * @param node
     * @param props
     */
    var setProps = function (node, props) {
        var value;
        for (var key in props) {
            if (props[key] === void 0) {
                node.removeAttribute(key);
            } else {
                value = props[key];
                utils.setAttr(node, key, value);
            }
        }
    };

    /**
     * 对子元素的排序
     * @param node
     * @param moves
     * @param walker
     */
    var reorderChildren = function (node, moves, walker) {

        var staticNodeList = utils.getChildren(node);
        var maps = {};
        var childNodes, nodeItem, move;

        for (var i = 0, len = staticNodeList.length; i < len; i++) {

            nodeItem = staticNodeList[i];

            if (nodeItem.nodeType === 1) {
                var key = utils.getItemKey(nodeItem);
                if (key) {
                    maps[key] = nodeItem;
                }
            }

        }

        for (var i = 0, len = moves.length; i < len; i++) {

            move = moves[i];

            var index = move.index;
            childNodes = utils.getChildren(node);

            if (move.type === REMOVE) {

                if (staticNodeList[index] === childNodes[index]) {
                    componentHandle(null, childNodes[index], walker);
                    node.removeChild(childNodes[index]);
                }

                staticNodeList.splice(index, 1);

            } else if (move.type === INSERT) {

                var insertNode;
                var key = utils.getItemKey(move.item);

                if (maps[key]) {
                    insertNode = maps[key];
                } else {
                    insertNode = move.item.cloneNode(true);
                    componentHandle(insertNode, null, walker);
                }

                staticNodeList.splice(index, 0, insertNode);
                node.insertBefore(insertNode, childNodes[index] || null);

            }

        }

    };

    patch.REPLACE = REPLACE;
    patch.REORDER = REORDER;
    patch.PROPS = PROPS;
    patch.TEXT = TEXT;
    patch.REMOVE = REMOVE;
    patch.INSERT = INSERT;

    module.exports = patch;

});