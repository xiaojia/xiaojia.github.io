/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:application/main',
    require: [
        './render',
        './server'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var idPrefix = Simple.Module.config.idPrefix;

    var utils = Simple.Utils;

    /**
     * 应用
     * @typedef {Module} Application
     * @extend Component
     */
    module.exports = Simple.Component.extend({

        $constructor: function () {

            var that = this;
            that.$super();

            that.style = [];
            that.children = {};
            that.componentCount = 0;
            that.id = idPrefix + that.componentCount++;

        },

        /**
         * application配置
         * @param data
         * @returns {exports}
         * @private
         */
        _set: function (data) {

            var that = this;

            if (data.style) {
                that.style = that.style.concat(data.style);
            }

            if (data.children) {
                that.children[data.childrenName] = data.children;
            }

            return that;

        },

        /**
         * 设置props, 只有在application下才可以使用该方法, 并且没有任何事件触发
         * @param props 需要更新的props
         * @param isSync 是否同步刷新
         * @param replace 是否直接替换
         */
        setProps: function (props, isSync, replace) {

            var that = this;

            if (that.template) {

                if (replace) {
                    that.props = props;
                } else {
                    utils.extend(that.props, props);
                }

                that.template.setProps(props, isSync);

            } else {
                that.props = props;
            }

            return that;

        },

        /**
         * 同 setProps 方法, 只是此方法会替换掉之前的参数
         * @param props 新的props
         * @param isSync 是否同步
         * @returns {*}
         */
        replaceProps: function (props, isSync) {
            return this.setProps(props, isSync, true);
        },

        /**
         * node端运行的方法,此方法在文件编译之后会删除掉
         * @param context
         */
        server: require('./server'),

        /**
         * 应用渲染
         * @param context node端会传入上下文, 数据渲染完毕之后调用上下文的send方法, 使node反数据给客户端
         * @returns {exports}
         */
        render: require('./render')

    });

    module.exports.setName(module.id);

});