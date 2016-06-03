/*
 * simple-module
 *
 * name: xiaojia
 * date: 16/3/9
 */

!function (global, undefined) {

    "use strict";

    var Simple = global.Simple = global.Simple || {};

    /**
     * 模块入口文件
     */
    var ModuleMain;

    /**
     * 同时加载文件数
     * @type {number}
     */
    var ModuleLoadCount = 0;

    /**
     * 模块缓存
     * @type {{}}
     */
    var ModuleCache = {};

    /**
     * 加载文件缓存
     * @type {{}}
     */
    var FileCache = {};

    /**
     * 状态
     * @type {{INIT: string, SUCCESS: string}}
     */
    var State = {
        INIT: 'initialize',
        SUCCESS: 'success'
    };

    /**
     * 模式, 浏览器 or WebWorker
     * @type {boolean}
     */
    var IsBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document);
    var IsWebWorker = !IsBrowser && typeof importScripts !== 'undefined';
    var IsNode = !!(typeof module !== 'undefined' && module.exports);

    /**
     * 是否为IE, 如果为IE则返回版本号
     * @type {number}
     */
    var IsIE = 0;
    if (IsBrowser) {
        var ua = navigator.userAgent;
        if (ua.indexOf('MSIE') >= 0) {
            IsIE = parseInt(/msie\s+(\d+)/ig.exec(navigator.userAgent)[1]);
        }
    }

    /**
     * 是否为windows系统
     * @type {boolean}
     */
    var IsWindows = false;
    if (IsNode) {
        if (process.platform === 'win32') {
            IsWindows = true;
        }
    }

    /**
     * 模块定义
     * @param config
     * @param callback
     * @constructor
     */
    var Module = function (config, callback) {

        var that = this;

        if (typeof config === 'string') {
            config = {name: config};
        }

        /**
         * 设置名字
         */
        that.name = config.name;

        /**
         * 检查名字
         */
        that.checkName();

        /**
         * 初始化
         */
        that.config = config;
        that.callback = callback;
        that.root = config.root;
        that.requires = [];

        that.module = {
            id: config.name,
            filename: Module.source(config.name),
            exports: {},
            parent: null,
            loaded: false
        };

        that.loaded = false;
        that.require = config.require || null;
        that.requireCount = config.require ? config.require.length : 0;
        that.exports = {};

        /**
         * 检查是否定义过, 如果没有定义则定义
         */
        if (!that.checkDefine()) {
            that.init();
        }

    };

    Module.prototype = {

        /**
         * 初始化模块
         */
        init: function () {

            var that = this;

            /**
             * 正在加载 +1
             */
            ModuleLoadCount++;
            ModuleCache[that.name] = that;

            /**
             * 第一个加载的是入口 或者 带入口标识
             */
            if (ModuleLoadCount === 1 || that.root) {
                ModuleMain = that;
            }

            if (IsNode) {
                that.requireHandle();
            } else {

                /**
                 * 延迟处理, 保证一个文件定义多个模块时正确处理
                 */
                setTimeout(function () {
                    that.requireHandle.call(that);
                    that = null;
                }, Module.DELAY_TIME);

            }

        },

        /**
         * 计算文件依赖
         */
        requireHandle: function () {

            var that = this, path;

            if (that.require && that.require.length > 0) {

                var require = that.require;

                for (var i = 0, len = require.length; i < len; i++) {

                    path = Module.path(that.name, require[i]);

                    if (that.requires.indexOf(path) === -1) {
                        that.requires.push(path);
                    }

                    that.loadModuleHandle(path);

                }

            } else {
                that.requireSuccess();
            }

        },

        /**
         * 加载模块文件
         * @param name
         */
        loadModuleHandle: function (name) {

            var that = this;

            /**
             * 超时倒计时
             * @type {number}
             */
            var timer = setTimeout(function () {
                throw 'timeout 模块加载超时 ' + (Module.TIMEOUT_DEFAULT / 1000) + '秒 ' + name + '\n' + Module.source(name);
            }, Module.TIMEOUT_DEFAULT);

            var success = function () {

                /**
                 * 终止超时计时
                 */
                clearTimeout(timer);

                /**
                 * 模块依赖文件加载
                 */
                if (!(--that.requireCount)) {
                    that.requireSuccess();
                }

                that = null;

            };

            if (that.checkDefine(name)) {
                success();
            } else {
                Module.loader(name, success);
            }

        },

        /**
         * 所有依赖文件加载完毕
         */
        requireSuccess: function () {

            /**
             * 当文件全部加载完毕, 执行入口程序
             */
            if (!(--ModuleLoadCount)) {
                ModuleMain.success();
            }

        },

        /**
         * 依赖加载完毕之后的callback
         * @param parent
         * @returns {Module}
         */
        success: function (parent) {

            var that = this;

            if (!that.loaded) {

                /**
                 * 文件加载状态
                 * @type {boolean}
                 */
                that.loaded = true;

                /**
                 * 父模块
                 */
                parent && (that.module.parent = parent);

                /**
                 * 执行方法
                 */
                that.callbackHandle();

                /**
                 * 输出
                 * @type {Module.module.exports|{}}
                 */
                that.exports = that.module.exports;

                /**
                 * 设置模块状态
                 * @type {boolean}
                 */
                that.module.loaded = true;

            }

            return that;

        },

        /**
         * 执行function
         */
        callbackHandle: function () {
            var that = this;
            that.callback && that.callback(function () {
                return Module.require.apply(that, arguments);
            }, that.module, that.module.exports, Simple);
        },

        /**
         * 获取exports
         * @returns {{}|*}
         */
        getExports: function () {
            return this.exports;
        },

        /**
         * 检查名字
         */
        checkName: function () {
            if (!(typeof this.name === 'string' && this.name)) {
                throw 'module 模块必须有名字';
            }
        },

        /**
         * 检查定义
         * @param name
         * @returns {boolean}
         */
        checkDefine: function (name) {
            return ModuleCache[name || this.name] !== undefined;
        },

        constructor: Module

    };

    /**
     * 获取真是路径
     * @param name
     * @param exp
     * @param packages
     * @returns {*}
     */
    Module.source = function (name, exp, packages) {

        if (IsWindows && name.search(/^\w:\\/ig) === 0) {
            return name.replace(/\//ig, '\\');
        }

        if (name) {
            if (name.indexOf('http') === 0 || name.indexOf(':') === -1) {
                return name;
            } else if (Simple.config) {
                name = name.split(':');
                return (packages || Simple.config.packages)[name[0]] + (name[1] || '') + (exp === null ? '' : (exp || '.js'));
            } else {
                return null;
            }
        }

    };

    /**
     * 路径格式化
     * @param path
     */
    Module.normalize = function (path) {

        var splitDeviceRe = /^(http:\/\/|https:\/\/|[\/]{2}[^\/]+[\/]+[^\/]+)?([\/])?([\s\S]*?)$/;

        var statPath = function (path) {
            var result = splitDeviceRe.exec(path),
                device = result[1] || '';
            return {
                device: device,
                isAbsolute: !!result[2],
                tail: result[3]
            };
        };

        var normalizeArray = function (parts, allowAboveRoot) {
            var res = [];
            for (var i = 0; i < parts.length; i++) {
                var p = parts[i];
                if (!p || p === '.')
                    continue;
                if (p === '..') {
                    if (res.length && res[res.length - 1] !== '..') {
                        res.pop();
                    } else if (allowAboveRoot) {
                        res.push('..');
                    }
                } else {
                    res.push(p);
                }
            }
            return res;
        };

        var normalize = function (path) {

            var result = statPath(path),
                device = result.device,
                isAbsolute = result.isAbsolute,
                tail = result.tail,
                trailingSlash = /[\/]$/.test(tail);

            tail = normalizeArray(tail.split(/[/:]+/), !isAbsolute).join('/');

            if (!tail && !isAbsolute) {
                tail = '.';
            }

            if (tail && trailingSlash) {
                tail += '/';
            }

            return device + (isAbsolute ? '/' : '') + tail;

        };

        return normalize(path);

    };

    /**
     * 转成成绝对路径
     * @param name
     * @param path
     * @returns {*}
     */
    Module.path = function (name, path) {
        if (path.indexOf('.') === 0) {
            path = Module.normalize(name.replace(/(\/|:)[\w-]*$/ig, '/') + path).replace(/\.\//ig, '/').replace(/(^[^\/]+)\//ig, '$1:');
        }
        return path;
    };

    /**
     * 浏览器端加载文件模块
     * @param name
     * @param callback
     */
    Module.browser = function (name, callback) {

        var src = Module.source(name);
        var file = FileCache[src];

        /**
         * 如果已经定义
         */
        if (file) {
            if (file.state === State.SUCCESS) {
                callback();
            } else {
                file.callback.push(callback);
            }
        } else {

            var script = document.createElement('script');
            script.src = src;

            FileCache[src] = {
                state: State.INIT,
                callback: [callback]
            };

            /**
             * 文件加载成功
             */
            var success = function () {

                script = null;

                /**
                 * 执行之前的回调
                 * @type {Array|*|reduceBody|collectReducedBodies}
                 */
                var callbacks = FileCache[src].callback;
                for (var i = 0, len = callbacks.length; i < len; i++) {
                    callbacks[i](src);
                }

                FileCache[src].callback = [];
                FileCache[src].state = State.SUCCESS;

            };

            if ('onload' in script) {
                script.onload = success;
                script.onerror = function () {
                    throw 'file 文件加载失败 ' + src;
                };
            } else {
                script.attachEvent('onreadystatechange', function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        success();
                    }
                });
            }

            document.head.appendChild(script);

        }

    };

    /**
     * webWorker模式下加载模块
     * @param name
     * @param callback
     */
    Module.webWorker = function (name, callback) {
        self.importScripts(Module.source(name));
        callback();
    };

    /**
     * nodejs端加载模块
     * @param name
     * @param callback
     */
    Module.nodeJS = function (name, callback) {
        Simple.require(name);
        callback();
    };

    /**
     * require
     * @param path
     * @returns {*}
     */
    Module.require = function (path) {

        if (path.indexOf(':') === -1 && path.search(/\w/ig) === 0) {
            if (IsNode) {
                return require(path);
            } else {
                return null;
            }
        } else {

            var that = this;
            var name = that.name;

            path = Module.path(name, path);

            var module = ModuleCache[path];

            if (module) {
                return module.success(that.module).getExports();
            } else {
                if (IsNode) {
                    return require(Module.source(path));
                } else {
                    throw 'require 找不到模块 ' + path + '\n filename: ' + that.module.filename + '\n name: ' + name;
                }
            }

        }

    };

    /**
     * 加载器, 传入扩展名和方法
     * @param name 扩展名
     * @param callback 执行方法
     */
    Module.loader = function (name, callback) {

        var ext = '.js';
        var filename = name.replace(/^.*\//ig, '');

        if (filename.indexOf('.') > -1) {
            ext = /\.\w+$/ig.exec(filename);
            ext && (ext = ext[0]);
        }

        if (IsBrowser) {
            Module.loader.define.browser[ext](name, callback);
        } else if (IsWebWorker) {
            Module.loader.define.webWorker[ext](name, callback);
        } else if (IsNode) {
            Module.loader.define.node[ext](name, callback);
        }

    };

    /**
     * 传入模块名字返回此模块所有的依赖
     * @param path
     * @returns {Array}
     */
    Module.depend = function (path) {

        var depend = [];
        var module = ModuleCache[path];

        var item;

        if (module) {
            var requires = module.requires;
            if (requires.length) {
                for (var i = 0, len = requires.length; i < len; i++) {
                    item = requires[i];
                    if (item !== path) {
                        depend.push(item);
                        depend = depend.concat(Module.depend(item));
                    }
                }
            }
        }

        return depend;

    };

    /**
     * 定义加载模式
     * @type {{browser: {[.js]: (Module.browser|*)}, webWorker: {[.js]: (Module.webWorker|*)}, node: {[.js]: (Module.nodeJS|*)}}}
     */
    Module.loader.define = {
        browser: {'.js': Module.browser},
        webWorker: {'.js': Module.webWorker},
        node: {'.js': Module.nodeJS}
    };

    /**
     * 默认加载超时时间
     * @type {number}
     */
    Module.TIMEOUT_DEFAULT = 6000;

    /**
     * 延迟处理
     * @type {number}
     */
    Module.DELAY_TIME = 0;

    /**
     * 模块加载器
     * @param config
     * @param callback
     * @returns {Module}
     * @constructor
     */
    Simple.Module = function (config, callback) {
        return new Module(config, callback);
    };

    /**
     * 设置超时时间
     * @param timeout
     */
    Simple.Module.setTimeout = function (timeout) {
        Module.TIMEOUT_DEFAULT = timeout;
    };

    /**
     * 文件加载器
     * @param extension
     * @param handle
     * @param platform
     */
    Simple.Module.loader = function (extension, handle, platform) {
        Module.loader.define[platform][extension] = handle;
    };

    /**
     * 模块缓存
     * @type {{}}
     */
    Simple.Module.cache = ModuleCache;

    /**
     * 路径处理
     * @type {Module.path|*}
     */
    Simple.Module.path = Module.path;
    Simple.Module.path.normalize = Module.normalize;
    Simple.Module.path.source = Module.source;

    /**
     * 获取所有依赖文件
     * @type {Module.depend|*}
     */
    Simple.Module.depend = Module.depend;

    /**
     * 判断平台信息
     * @type {{browser: boolean, webWorker: boolean, node: (boolean|*), ie: boolean}}
     */
    Simple.platform = {
        browser: IsBrowser,
        webWorker: IsWebWorker,
        node: IsNode,
        ie: IsIE
    };

}(typeof global !== 'undefined' ? global : window);