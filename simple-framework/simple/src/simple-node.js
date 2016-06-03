/*
 * simple-core
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.require = function (path) {

    var that = this;

    if (path.indexOf(':') > -1) {

        var module = Simple.Module.cache[path];

        if (module) {
            return module.success(that.module).getExports();
        } else {
            path = path.split(':');
            return require(Simple.config.packages[path[0]] + (path[1] || ''));
        }

    }

};

require('./simple-module');
require('./simple-core');