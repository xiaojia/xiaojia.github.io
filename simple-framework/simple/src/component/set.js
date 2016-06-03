/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:component/set',
    require: [
        './data'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var dataHandle = require('./data');

    /**
     * 设置类的属性
     * @param data
     * @returns {exports}
     * @private
     */
    module.exports = function (data) {

        var that = this;

        if (data.app) {
            that.app = data.app;
        }

        if (data.props) {
            dataHandle.setProps(data.props, that);
        }

        if (data.content) {
            that.content = data.content.join('');
        }

        if (data.parent) {
            that.parent = data.parent;
            that.parent._set({
                children: that,
                childrenName: data.name
            });
        }

        if (data.children) {
            that.children[data.childrenName] = data.children;
        }

        return that;

    }

});