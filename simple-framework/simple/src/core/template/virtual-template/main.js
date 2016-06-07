/*
 * main
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-template/main',
    require: [
        './dom',
        './utils',
        '../virtual-dom/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var comID = Simple.Module.config.comID;
    var idPrefix = Simple.Module.config.idPrefix;

    var svd = require('../virtual-dom/main');
    var utils = require('./utils');
    var htmlToDOM = require('./dom');

    var diff = svd.diff;
    var patch = svd.patch;

    /**
     * 获取DOM元素,通过ID
     * @param attr 对应的属性名
     * @param target 从某个容器开始找
     * @param id 对应的属性值
     * @returns {*||null} 返回找到的元素
     */
    var getIDforChildren = function (attr, target, id) {

        if (target.getAttribute(attr) === id) {
            return target;
        }

        var children = target.children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i].getAttribute(attr) === id) {
                return children[i];
            }
        }

        return null;

    };

    /**
     * 获取对应ID的DOM元素, 如果是 simple-component 则跳过
     * @param target
     * @param id
     * @returns {*}
     */
    var getPageDom = function (target, id) {
        var tagName = target.tagName.toLowerCase();
        if (tagName === 'simple-component') {
            return null;
        } else {
            return getIDforChildren(comID, target, id);
        }
    };

    /**
     * 设置元素的ID
     * @param DOM
     * @param id
     */
    var setDomID = function (DOM, id) {
        if (id && !DOM.getAttribute(comID)) {
            DOM.setAttribute(comID, id);
        }
    };

    /**
     * 执行模版渲染,并把HTML字符串转成DOM对象
     * @param data 渲染所需要的数据
     * @returns {*}
     * @private
     */
    var makeVirtualDOM = function (that, data) {
        return htmlToDOM(that.view(data));
    };

    /**
     * 虚拟模版
     * @typedef {Module} virtualTemplate
     * @extend Object
     */
    module.exports = Simple.Object.extend({

        /**
         * 渲染虚拟模版
         * @returns {exports}
         */
        render: function () {

            var that = this;

            that.isDirty = false;
            that.flushCallbacks = [];

            if (that.target) {
                var pageDom = getPageDom(that.target, that.id);
                if (pageDom) {
                    that.DOM = pageDom;
                    that.flush();
                    return that;
                }
            }

            that.DOM = makeVirtualDOM(that);

            setDomID(that.DOM, that.id);

            if (that.DOM.getAttribute(comID) === idPrefix + '0') {

                if (that.target) {
                    that.target.appendChild(that.DOM);
                }

            } else {
                throw new TypeError('render error <Simple.Application> 必须有一个容器');
            }

            return that;

        },

        /**
         * 立即对比新旧DOM, 更新
         * @param data
         * @returns {*}
         */
        flush: function (data, callabck) {

            var that = this;
            var DOM, patches, patchResult;

            if (typeof data === 'string') {
                DOM = htmlToDOM(data);
            } else {
                DOM = makeVirtualDOM(that, data);
            }

            setDomID(DOM, that.id);

            patches = diff(that.DOM, DOM);
            patchResult = patch(that.DOM, patches);

            if (patchResult.newNode) {
                that.DOM = patchResult.newNode;
                patchResult.newNode = null;
                patchResult.oldNode = null;
            }

            that.isDirty = false;

            callabck && callabck(patches, patchResult);

            var callbacks = that.flushCallbacks;
            for (var i = 0, len = callbacks.length; i < len; i++) {
                callbacks[i] && callbacks[i]();
                callbacks[i] = null;
            }

            that.flushCallbacks = [];

        },

        /**
         * 设置数据, 更新页面上的DOM元素
         * @param data 需要更新的数据
         * @param isSync 是否为同步渲染, true 立即渲染, false 等到浏览器下次刷新
         * @param callback 更新成功后的回调, 针对异步渲染
         * @returns {exports}
         */
        setData: function (data, isSync, callback) {

            var that = this;

            if (typeof isSync === 'boolean' && isSync) {
                that.flush(data, callback);
            } else if (!that.isDirty) {

                that.isDirty = true;

                utils.nextTick(function () {

                    that.flush(data, callback);

                    data = null;
                    callback = null;
                    that = null;

                });

            }

            if (typeof isSync === 'function') {
                that.flushCallbacks.push(isSync);
            }

            return that;

        },

        /**
         * 更新页面的HTML元素, 同样也会做DIFF, 做最小操作渲染
         * @param html 需要更新的HTML字符串
         * @param isSync 是否为异步渲染, false 立即渲染, true 等到浏览器下次刷新
         * @param callback 更新成功后的回调, 针对异步渲染
         * @returns {exports}
         */
        setHTML: function (html, isSync, callback) {
            return this.setData(html, isSync, callback);
        }

    });

});