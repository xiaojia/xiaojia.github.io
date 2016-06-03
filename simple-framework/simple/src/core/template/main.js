/*
 * main
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/main',
    require: [
        './virtual-template/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var comID = Simple.Module.config.comID;
    var componentGlobal = Simple.Component.component;
    var utils = Simple.Utils;
    var virtualTemplate = require('./virtual-template/main');

    /**
     * 获取子元素的组件
     * @param dom dom元素
     * @returns {Array} 返回所有找到的组件
     */
    var getChildrenComponent = function (dom) {

        var children = [], child;
        var domChildren = dom.children;

        for (var i = 0, len = domChildren.length; i < len; i++) {
            child = domChildren[i];
            if (child.getAttribute(comID)) {
                children.push(child);
            } else {
                children = children.concat(getChildrenComponent(child));
            }
        }

        return children;

    };

    /**
     * 渲染子组件
     * @param dom
     * @param handle
     */
    var renderChildren = function (dom, handle) {

        var status = Simple.Component.STATUS;

        utils.each(getChildrenComponent(dom), function (dom) {
            var id = dom.getAttribute(comID);
            var com = componentGlobal[id];
            if (com && com.status === status.INITIALIZE) {
                handle(com, dom);
            }
        });

    };

    /**
     * 获取需要render的component
     * @param dom
     * @param handle
     */
    var getComponent = function (dom, handle) {

        var com = componentGlobal[dom.getAttribute(comID)];
        var status = Simple.Component.STATUS;

        if (com) {
            if (com.status === status.INITIALIZE) {
                handle(com, dom);
            } else {
                renderChildren(dom, handle);
            }
        } else {
            renderChildren(dom, handle);
        }

    };

    /**
     * 移除需要移除的组件
     * @param ids 组件的id
     */
    var removeComponent = function (ids) {
        var com;
        for (var i = 0, len = ids.length; i < len; i++) {
            if (com = componentGlobal[ids[i]]) {
                com.unmount();
            }
        }
    };

    /**
     * 找到所有没有渲染的组件,渲染
     * @param that
     */
    var createComponent = function (that) {
        getComponent(that.virtualDOM.DOM, function (com, dom) {
            com.render(dom);
        });
    };

    /**
     * 模版
     * @typedef {Module} Template
     * @extend Object
     */
    module.exports = Simple.Object.extend({

        /**
         * 模版渲染
         * @returns {exports}
         */
        render: function () {

            var that = this;

            if (Simple.platform.node) {
                return that.toString().replace(/^(<[^>]+)>/ig, '$1 ' + comID + '="' + that.id + '">');
            } else {

                that.virtualDOM = virtualTemplate.create({
                    id: that.id,
                    target: that.target,
                    view: that.toString.bind(that)
                });

                that.virtualDOM.render();

                createComponent(that);

            }

            return that;

        },

        /**
         * 执行view, 把模版转换成html字符串
         * @param data 渲染所需要的数据
         * @returns {String} 返回HTML字符串
         */
        toString: function (data) {
            var that = this;
            return that.view.render(data || that.data, that.id, that.controller, that.app);
        },

        /**
         * 强制刷新
         * @param state
         * @param props
         * @param isSync
         * @param callback
         */
        forceUpdate: function (data, isSync, callback) {

            var that = this;

            /**
             * 合并数据
             */
            utils.extend(that.data, data);

            /**
             * 只有在浏览器端才会运行
             */
            if (Simple.platform.browser) {

                /**
                 * 和setProps, setState不一样的是, 不管是否有更新, 都会执行回调
                 */
                that.virtualDOM.setData(that.data, isSync, function (patches, patchResult) {
                    if (utils.keys(patches).length > 0) {
                        removeComponent(patchResult.remove);
                        createComponent(that);
                    }
                    callback && callback();
                });

            }

            return that;

        },

        /**
         * 设置页面props, 只允许程序调用
         * @param props 需要更改的props
         * @param isSync 是否同步渲染
         * @param callback 更新DOM后的回调
         * @returns {exports}
         */
        setProps: function (props, isSync, callback) {

            var that = this;

            that.data.props = props;

            /**
             * 只有在浏览器端才会运行
             */
            if (Simple.platform.browser) {

                that.virtualDOM.setData(that.data, isSync, function (patches, patchResult) {

                    /**
                     * 如果没有改变则不回调
                     */
                    if (utils.keys(patches).length > 0) {
                        removeComponent(patchResult.remove);
                        createComponent(that);
                        callback && callback();
                    }

                });

            }

            return that;

        },

        /**
         * 设置页面的数据状态
         * @param state 更新的数据
         * @param isSync 是否同步渲染
         * @param callback 更新DOM后的回调
         * @returns {exports}
         */
        setState: function (state, isSync, callback) {

            var that = this;

            that.data.state = state;

            /**
             * 只有在浏览器端才会运行
             */
            if (Simple.platform.browser) {

                that.virtualDOM.setData(that.data, isSync, function (patches, patchResult) {

                    /**
                     * 如果没有改变则不回调
                     */
                    if (utils.keys(patches).length > 0) {
                        removeComponent(patchResult.remove);
                        createComponent(that);
                        callback && callback();
                    }

                });
            }

            return that;

        },

        /**
         * 设置页面的数据状态,只是以HTML字符串的形式更新
         * @param html 要渲染的HTML字符串
         * @param isSync 是否为异步更新
         * @param callback 更新DOM后的回调
         * @returns {exports}
         */
        setHTML: function (html, isSync, callback) {

            var that = this;

            /**
             * 只有在浏览器端才会运行
             */
            if (Simple.platform.browser) {
                that.virtualDOM.setHTML(html, isSync, function (patches, patchResult) {

                    /**
                     * 如果没有改变则不回调
                     */
                    if (utils.keys(patches).length > 0) {
                        removeComponent(patchResult.remove);
                        createComponent(that);
                        callback && callback();
                    }

                });
            }

            return that;

        }

    });

    module.exports.setName(module.id);

});