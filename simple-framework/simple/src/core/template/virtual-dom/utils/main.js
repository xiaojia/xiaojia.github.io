/*
 * utils
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-dom/utils/main'
}, function (require, module, exports, Simple) {

    "use strict";

    var comID = Simple.Module.config.comID;
    var listKey = Simple.Module.config.listKey;

    module.exports = {

        /**
         * 获取DOM下的所有元素, 移除所有空格
         * @param dom
         * @returns {Array}
         */
        getChildren: function (dom) {

            var child = [];
            var childNodes = dom.childNodes;

            for (var i = 0, len = childNodes.length; i < len; i++) {
                switch (childNodes[i].nodeType) {
                    case 3:
                        if ((childNodes[i].nodeValue || childNodes[i].textContent).replace(/\s|\n/ig, '') !== '') {
                            child.push(childNodes[i]);
                        }
                        break;
                    case 1:
                        child.push(childNodes[i]);
                        break;
                }
            }

            return child;

        },

        /**
         * 获取元素的唯一标识, key 或者是 组件
         * @param item
         * @returns {*}
         */
        getItemKey: function (item) {
            if (item && item.nodeType === 1) {
                return item.getAttribute(listKey) || item.getAttribute(comID);
            }
            return void 0;
        },

        /**
         *  设置元素的属性
         * @param node
         * @param key
         * @param value
         */
        setAttr: function setAttr(node, key, value) {
            switch (key) {
                case 'style':
                    node.style.cssText = value;
                    break;
                case 'class':
                    node.className = value;
                    break;
                case 'value':
                    var tagName = node.tagName || '';
                    tagName = tagName.toLowerCase();
                    if (tagName === 'input' || tagName === 'textarea') {
                        node.value = value;
                    } else {
                        node.setAttribute(key, value);
                    }
                    break;
                default:
                    node.setAttribute(key, value);
                    break;
            }
        }

    };

});