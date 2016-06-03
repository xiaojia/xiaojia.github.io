/*
 * render
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:application/render',
    require: [
        './utils'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = require('./utils');

    /**
     * 应用入口
     * context node端会传入上下文, 数据渲染完毕之后调用上下文的send方法, 使node反数据给客户端
     * @param params 参数
     * @param context 上下文
     * @returns {module}
     */
    module.exports = function (context) {

        var that = this;

        /**
         * 不允许重复调用
         */
        if (that.template) {
            return that;
        }

        /**
         * 初始化
         */
        utils.createComponent(that);

        /**
         * 初始化数据
         * @type {exports.stores|{homeList}}
         */
        utils.willMount(that, function () {

            /**
             * 初始化模版
             * @type {*|makeClass|Object}
             */
            var template = Simple.Template.create({
                id: that.id,
                app: that,
                view: that.view,
                controller: that,
                data: {
                    props: that.props
                },
                target: Simple.config.container
            });

            /**
             * 渲染
             */
            that.template = template.render();

            /**
             * 服务端渲染
             */
            if (Simple.platform.node && context) {
                that.server(context);
            }

            /**
             * 只在客户端执行
             */
            if (Simple.platform.browser) {
                that.didMount();
            }

        });

        return that;

    };

});