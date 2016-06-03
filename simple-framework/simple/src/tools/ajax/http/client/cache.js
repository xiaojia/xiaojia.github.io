/*
 * cache
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:tools/ajax/http/client/cache'
}, function (require, module, exports, Simple) {

    var utils = Simple.Utils;

    /**
     * 缓存
     * @param options ajax配置信息
     */
    module.exports = function (options) {

        /**
         * 读取缓存信息
         */
        var data = storage.getData(options.url);

        if (data) {

            return {
                abort: utils.noop
            };

        } else {
            return false;
        }

    };

});