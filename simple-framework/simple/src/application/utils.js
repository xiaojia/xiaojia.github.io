/*
 * handle
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:application/utils'
}, function (require, module, exports, Simple) {

    "use strict";

    var deferred = Simple.Deferred;
    var idPrefix = Simple.Module.config.idPrefix;

    /**
     * 实例化页面所需要的组件
     * @param that
     */
    var createComponent = function (that) {

        var componentItem;
        var com = that.component;
        var component = {};

        for (var e in com) {
            componentItem = component[e];
            if (!(componentItem instanceof Simple.Object)) {
                component[e] = com[e].create({
                    app: that,
                    id: idPrefix + that.componentCount++
                });
            }
        }

        that.instantiateComponent = component;

    };

    /**
     * 服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。
     * 如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
     * application下的willMount为异步方法, 可以在这里做异步操作
     */
    var willMount = function (that, callback) {

        if (that.willMount) {

            var dtd = deferred();

            that.willMount(dtd);

            dtd.then(callback, callback)['catch'](function (e) {
                console && console.error(e);
            });

        } else {
            callback();
        }

    };

    module.exports = {
        createComponent: createComponent,
        willMount: willMount
    };

});