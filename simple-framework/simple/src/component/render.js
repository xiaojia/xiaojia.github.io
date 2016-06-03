/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:component/render',
    require: [
        './utils',
        './event'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = require('./utils');
    var DOMEvent = require('./event');
    var STATUS = utils.STATUS;

    /**
     * 渲染组件
     * @param target 渲染到容器
     * @returns {*}
     */
    module.exports = function (target) {

        var that = this;

        if (that.node === false && Simple.platform.node) {
            return '<simple-component></simple-component>';
        } else {

            if (that.status === STATUS.INITIALIZE) {

                /**
                 * 修改状态
                 * @type {string}
                 */
                that.status = STATUS.RENDER;

                utils.createComponent(that);

                /**
                 * 传入样式
                 */
                that.app._set({
                    style: that.view.style
                });

                /**
                 * 服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。
                 * 如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
                 */
                that.willMount();

                that.template = Simple.Template.create({
                    id: that.id,
                    view: that.view,
                    app: that,
                    controller: that,
                    data: {
                        props: that.props,
                        state: that.state,
                        content: that.content
                    },
                    target: target
                });

                that.template = that.template.render();

                /**
                 * 在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现
                 * 如果想和其它 JavaScript 框架集成，使用 setTimeout 或者 setInterval 来设置定时器，或者发送 AJAX 请求，可以在该方法中执行这些操作。
                 */
                if (Simple.platform.browser) {

                    that.event = DOMEvent.create({
                        itself: that.template.virtualDOM.DOM
                    });

                    that._isMounted = true;

                    that.didMount(that.getDOMNode());

                }

            }

            return that.template;

        }

    }

});