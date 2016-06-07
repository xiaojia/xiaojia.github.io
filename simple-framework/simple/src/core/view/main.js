/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/view/main',
    require: [
        './core'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var CssCache = {};
    var Utils = Simple.Utils;

    var engine = require('./core');

    /**
     * 加载css文件, 只有在浏览器端才运行
     * @param id
     * @param css
     * @returns {Array}
     */
    var loadCss = function (id, css) {

        var style = [];

        if (Simple.platform.browser) {

            Utils.each(css, function (css) {

                var path = Simple.Module.path(id, css);

                if (!CssCache[path]) {

                    style.push(path);

                    var link = document.createElement('link');
                    link.href = Simple.Module.path.source(path, '.css');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    document.head.appendChild(link);

                    CssCache[path] = true;

                }

            });

        } else {

            Utils.each(css, function (css) {

                var path = Simple.Module.path(id, css);

                if (!CssCache[path]) {
                    style.push(path);
                    CssCache[path] = true;
                }

            });

        }

        return style;

    };

    module.exports = Simple.Object.extend({

        $constructor: function () {

            var that = this;

            that.style = loadCss(that.id, that.style);

            if (typeof that.template === 'string') {
                that.template = (function (template) {
                    return function () {
                        return template;
                    };
                })(that.template);
            } else {
                that.template = that.template.bind(engine);
            }

        },

        /**
         * 模版渲染
         * @param data
         * @param id
         * @param component
         * @param app
         * @returns {*}
         */
        render: function (data, id, component, app) {
            return this.template(data, id, component, app).toString();
        }

    });

    module.exports.reopenClass({

        /**
         * template helpers方法
         */
        helpers: engine.$helpers

    });

    module.exports.setName(module.id);

});