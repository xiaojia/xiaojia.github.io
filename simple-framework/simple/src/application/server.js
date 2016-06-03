/*
 * server
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:application/server'
}, function (require, module, exports, Simple) {

    "use strict";

    module.exports = function (context) {

        var that = this;

        /**
         * 返回给node处理程序
         */
        context.send({
            code: 200,
            type: 'html',
            context: {
                title: that.name,
                name: that.name,
                body: that.template
            }
        });

    };

});