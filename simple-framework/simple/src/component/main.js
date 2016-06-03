/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:component/main',
    require: [
        './utils',
        './data',
        './render',
        './set'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = require('./utils');
    var dataHandle = require('./data');
    var render = require('./render');
    var _set = require('./set');

    var STATUS = utils.STATUS;

    /**
     * 组件
     * @typedef {Module} Component
     * @extend Object
     */
    module.exports = Simple.Object.extend({

        $constructor: function () {

            var that = this;

            that.$super();

            that.status = STATUS.INITIALIZE;
            that.component || (that.component = {});
            that.children = {};
            that.content = '';
            that._isMounted = false;

            module.exports.component[that.id] = that;

        },

        /**
         * 设置类的属性
         * @param data
         * @returns {exports}
         * @private
         */
        _set: _set,

        /**
         * 渲染组件
         * @param target 渲染到容器
         * @returns {*}
         */
        render: render,

        /**
         * 强制刷新, 只会调用 didUpdate 回调
         * @param isSync 是否同步刷新
         */
        forceUpdate: dataHandle.forceUpdate,

        /**
         * 设置数据状态, 更新页面
         * @param state 更新后的数据
         * @param isSync 是否为同步形式
         * @returns {exports}
         */
        setState: dataHandle.setState,

        /**
         * 同 setState, 但是删除之前所有已存在的 state 键;。
         * @param state
         * @param isSync 是否为同步形式
         */
        replaceState: dataHandle.replaceState,

        /**
         * 以HTML字符串形式设置数据状态, 更新页面
         * @param html 需要更新的HTML字符串
         * @param isSync 是否为同步形式
         * @returns {exports}
         */
        setHTML: dataHandle.setHTML,

        /**
         * 触发事件
         * @param name 事件名称
         * @param value 值
         * @returns {exports}
         */
        action: function (name, value) {
            this.app.emit(name, value);
            return this;
        },

        /**
         * 返回DOM下所有带ref属性的Node
         * @param {Document} DOM DOM节点
         * @param refs
         * @returns {Object} 返回一组DOM节点
         */
        getDOMNode: function () {
            return utils.parseDOMref(this.template.virtualDOM.DOM, {});
        },

        /**
         * 如果组件渲染到了 DOM 中，isMounted() 返回 true。可以使用该方法保证 setState() 和 forceUpdate() 在异步场景下的调用不会出错。
         * @returns {boolean}
         */
        isMounted: function () {
            return this._isMounted;
        },

        /**
         * 服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。
         * 如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
         */
        willMount: function () {
        },

        /**
         * 在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现
         * 如果想和其它 JavaScript 框架集成，使用 setTimeout 或者 setInterval 来设置定时器，或者发送 AJAX 请求，可以在该方法中执行这些操作。
         * @param refDOM
         */
        didMount: function (refDOM) {
        },

        /**
         * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
         * 旧的 props 可以通过 this.getProps 获取到;
         * @param nextProps
         */
        willReceiveProps: function (nextProps) {
        },

        /**
         * 在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。
         * 如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。
         * @param nextState
         * @param nextProps
         */
        shouldUpdate: function (nextState, nextProps) {
        },

        /**
         * 在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。
         * @param nextState
         * @param nextProps
         */
        willUpdate: function (nextState, nextProps) {
        },

        /**
         * 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。
         * 使用该方法可以在组件更新之后操作 DOM 元素。
         * @param prevState
         * @param prevProps
         */
        didUpdate: function (prevState, prevProps) {
        },

        /**
         * 在组件从 DOM 中移除的时候立刻被调用。
         * 在该方法中执行任何必要的清理，比如无效的定时器，或者清除在 didMount 中创建的 DOM 元素。
         */
        willUnmount: function () {
        },

        /**
         * 移除组件
         */
        unmount: function () {

            var that = this;

            var children = that.children;
            for (var e in children) {
                children[e].unmount();
            }

            if (that.parent) {
                delete that.parent.children[that.name];
            }

            that.chidlren = {};
            that.template = null;
            that.event = null;
            that.status = STATUS.INITIALIZE;
            that._isMounted = false;

            /**
             * 在组件从 DOM 中移除的时候立刻被调用。
             * 在该方法中执行任何必要的清理，比如无效的定时器，或者清除在 didMount 中创建的 DOM 元素。
             */
            that.willUnmount();

        }

    });

    module.exports.reopenClass({
        component: {},
        STATUS: STATUS
    });

    module.exports.setName(module.id);

});