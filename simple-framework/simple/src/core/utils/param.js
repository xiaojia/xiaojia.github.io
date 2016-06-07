/*
 * param
 *
 * name: xiaojia
 * date: 16/6/7
 */

Simple.Module({
    name: 'simple:core/utils/param',
    require: [
        './underscore'
    ]
}, function (require, module, exports, Simple) {

    var utils = require('./underscore');

    /**
     * 对象转换成字符串
     * @param a
     * @param traditional
     * @returns {string}
     */
    module.exports = function (a, traditional) {

        function buildParams(prefix, obj, traditional, add) {
            var name,
                rbracket = /\[\]$/;

            if (utils.isArray(obj)) {

                utils.each(obj, function (v, i) {
                    if (traditional || rbracket.test(prefix)) {
                        add(prefix, v);

                    } else {
                        buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                    }
                });

            } else if (!traditional && typeof obj === "object") {
                for (name in obj) {
                    buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                }
            } else {
                add(prefix, obj);
            }
        }

        var prefix,
            s = [],
            add = function (key, value) {
                key = encodeURIComponent(key);
                value = utils.isFunction(value) ? value() : (value == null ? "" : value);
                if (utils.isArray(value)) {
                    value = value[0];
                    utils.each(value.concat(), function (v) {
                        value = '&' + key + '=' + encodeURIComponent(v);
                    });
                } else {
                    value = encodeURIComponent(value);
                }
                s[s.length] = key + "=" + value;
            };

        if (utils.isArray(a)) {
            utils.each(a, function (v) {
                add(v.name, v.value);
            });

        } else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        return s.join("&").replace(/%20/g, "+");

    };

});