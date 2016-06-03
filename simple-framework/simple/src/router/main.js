/*
 * main
 *
 * name: lixun
 * date: 16/4/25
 */

Simple.Module({
    name: 'simple:router/main'
}, function (require, module, exports, Simple) {

    "use strict";

    module.exports = {
        template: Simple.Object.extend(),
        route: Simple.Object.extend()
    };

    module.exports.route.reopenClass({

        routerListening: [],

        defaultHandle: null,

        use: function (url, handle, customs) {

            var urlType = typeof url;
            if (urlType == 'string') {
                this.routerListening.push({
                    "pattern": url,
                    "handle": handle,
                    "customs": customs || {}
                });
            } else if (urlType == 'function') {
                this.defaultHandle = url;
            }
        },

        go: function (url, callback) {

            var that = this;
            var routerListening = that.routerListening;
            var urlObj = convertUrlObj(url);
            var urlPath = urlObj.path;
            var urlPathWithoutRoot = urlPath;
            var urlSearch = urlObj.search;
            var urlHash = urlObj.hash;

            // 重写urlPathWithoutRoot,移除固定根目录
            var rootUrl = Simple.config.root;
            if (rootUrl != null && rootUrl != '') {
                var rootUrlPath = convertUrlObj(rootUrl).path;

                // 检查根目录是否'/'结尾,并移除'/'
                if (rootUrlPath.charAt(rootUrlPath.length - 1) == '/') {
                    rootUrlPath = rootUrlPath.substring(0, rootUrlPath.length - 1);
                }

                urlPathWithoutRoot = urlPath.replace(rootUrlPath, '');
            }

            // 在浏览器端,如果处理的url不等于当前url,则重写浏览器url
            if (Simple.platform.browser) {
                var currUrl = window.location.href;
                var currUrlObj = convertUrlObj(currUrl);
                var currUrlFullPath = currUrlObj.path + (currUrlObj.search || '') + (currUrlObj.hash || '');
                var receiveFullPath = urlPath + (urlSearch || '') + (urlHash || '');

                if (currUrlFullPath != receiveFullPath) {
                    if ('pushState' in history) {
                        history.pushState({}, "", receiveFullPath);
                    } else {
                        window.location.href = receiveFullPath;
                    }
                }
            }

            var execStatus = false;
            for (var i = 0; i < routerListening.length; i++) {
                if (checkMatch(urlPathWithoutRoot, routerListening[i].pattern)) {
                    var urlParams = {};

                    // 获取路由参数
                    urlParams.path = parsePathParams(urlPathWithoutRoot, routerListening[i].pattern, routerListening[i].customs);

                    // 获取search参数
                    urlParams.search = parseSearchParams(urlSearch);

                    // 获取hash参数
                    urlParams.hash = parseHashParams(urlHash);

                    routerListening[i].handle(urlParams, callback);

                    execStatus = true;
                    break;
                }
            }

            if (!execStatus && this.defaultHandle != null) {
                this.defaultHandle(url, callback);
            }
        }

    });

    module.exports.route.setName(module.id);

    function convertUrlObj(url) {

        var REG_PROTOCOL = /(\w+):\/\//;
        var REG_DOMAIN_WITH_PROT = /\w+:\/\/([^:\/?#]+)/;
        var REG_DOMAIN_WITHOUT_PROT = /^([^:\/?#]+)/;
        var REG_PORT = /[^:\/?#]+:(\d+)/;
        var REG_PATH_WITH_HOST = /\w(\/[^?#]*)/;
        var REG_PATH_WITH_ROOT = /(\/[^?#]*)/;
        var REG_FILE_EXT = /\.(\w+)/;
        var REG_SEARCH = /(\?[^#]+)/;
        var REG_HASH = /(\#.+)/;

        var protocol = url.match(REG_PROTOCOL);
        protocol = protocol && protocol[1];

        var hostName = url.match(REG_DOMAIN_WITH_PROT);
        // 当传入的url没有包含协议时的解析
        if (!protocol) {
            hostName = url.match(REG_DOMAIN_WITHOUT_PROT);
        }
        hostName = hostName && hostName[1];

        var port = url.match(REG_PORT);
        // 修改：当传入url没有域名时，端口为null，默认端口80
        port = port === null ? hostName === null ? null : "80" : port[1];

        var path = null;
        if (url.charAt(0) === '/') {
            // 直接传入路径不包含域名
            path = url.match(REG_PATH_WITH_ROOT);
        } else {
            // 包含域名的完整路径
            path = url.match(REG_PATH_WITH_HOST);
        }
        // 没有传入路径时，默认根目录(/)
        path = path === null ? '/' : path[1];

        var fileExt = null;
        if (path) {
            fileExt = path.match(REG_FILE_EXT);
            fileExt = fileExt && fileExt[1];
        }

        var search = url.match(REG_SEARCH);
        search = search && search[1];

        var hash = url.match(REG_HASH);
        hash = hash && hash[1];

        var urlObj = {
            // 协议
            "protocol": protocol,
            // 域名
            "hostName": hostName,
            // 端口
            "port": port,
            // 路径(包含文件扩展名)
            "path": path,
            // 文件扩展名(仅仅是文件扩展名)
            "fileExt": fileExt,
            // 问号(?)和参数
            "search": search,
            // 锚(#)和参数
            "hash": hash
        };

        return urlObj;
    }

    function checkMatch(path, pattern) {
        var urlMatchObj = convertMapObj(path);
        var routerMatchObj = convertMapObj(pattern);

        // 根路径处理
        if (routerMatchObj.nodesLength == 0 && routerMatchObj.originalPath == '/') {
            if (urlMatchObj.nodesLength == 0 && urlMatchObj.originalPath == '/') {
                return true;
            }

            return false;
        }

        // 匹配路径
        for (var i = 0; i < routerMatchObj.nodesLength; i++) {
            var urlNode = urlMatchObj.nodes[i];
            var routerNode = routerMatchObj.nodes[i];
            var char = routerNode.charAt(0);

            // 支持匹配*号
            if (i == routerMatchObj.nodesLength - 1) {
                if (char == '*' && urlNode != null) {
                    return true;
                }

                if (urlMatchObj.nodesLength > routerMatchObj.nodesLength) {
                    return false;
                }
            }

            if (urlNode == null && char != '[') {
                return false;
            }

            if (urlNode != routerNode && char != ':' && char != '{' && char != '[') {
                return false
            }
        }

        // 匹配扩展名
        if (urlMatchObj.fileExt != routerMatchObj.fileExt) {
            if (urlMatchObj.fileExt != null && routerMatchObj.fileExt == '*') {
                return true;
            }

            return false;
        }

        return true;
    }

    function parsePathParams(path, pattern, customs) {
        var pathMapObj = convertMapObj(path);
        var patternMapObj = convertMapObj(pattern);

        return mapParams(pathMapObj, patternMapObj, customs);
    }

    function convertMapObj(path) {
        var originalPath = path;

        var path_sp = path.split('.');
        var pathWithoutExt = path_sp[0];
        var fileExt = null;
        if (path_sp.length == 2) {
            fileExt = path_sp[1];
        }

        if (originalPath === '/') {
            return {
                "originalPath": originalPath,
                "nodes": [],
                "nodesLength": 0,
                "fileExt": null
            };
        }

        var nodes = pathWithoutExt.substring(1, pathWithoutExt.length).split('/');

        return {
            "originalPath": originalPath,
            "nodes": nodes,
            "nodesLength": nodes.length,
            "fileExt": fileExt
        }
    }

    function mapParams(pathMapObj, patternMapObj, customs) {
        var params = {};

        for (var i = 0; i < patternMapObj.nodesLength; i++) {
            var pathNode = pathMapObj.nodes[i];
            var patternNode = patternMapObj.nodes[i];

            var char = patternNode.charAt(0);

            // 固定参数
            if (char == ':') {
                var varName = patternNode.substring(1, patternNode.length);
                params[varName] = pathNode;
            }

            // 可选参数
            if (char == '[') {
                var varName = patternNode.substring(1, patternNode.length - 1);
                params[varName] = pathNode || null;
            }

            // 自定义参数
            if (char == '{') {
                var varName = patternNode.substring(1, patternNode.length - 1);
                params[varName] = null;

                if (customs[varName] != null) {
                    params[varName] = customs[varName](pathNode, pathMapObj.originalPath);
                }
            }

            // *号匹配,直接返回路径
            if (char == '*') {
                var removeStr = patternMapObj.originalPath.substring(0, patternMapObj.originalPath.length - 1);
                return pathMapObj.originalPath.replace(removeStr, '');
            }
        }

        return params;
    }

    function parseSearchParams(search) {
        if (search == null) {
            return null;
        }

        // 去除?号
        search = search.substring(1, search.length);

        var search_sp = search.split('&');
        var params = {};

        for (var i = 0; i < search_sp.length; i++) {
            var node = search_sp[i];
            var node_sp = node.split('=');

            if (node_sp[0] == '') {
                continue;
            }

            var key = node_sp[0];
            var val = node_sp[1];

            if (params[key] == null) {
                params[key] = [];
            }

            // url编码解码
            if (val != null) {
                try {
                    val = decodeURIComponent(val);
                } catch (e) {
                }
            }

            params[key].push(val || null);
        }

        // 把没有同名参数的转换为单一值
        for (var keyName in params) {
            if (params[keyName].length == 1) {
                params[keyName] = params[keyName][0];
            }
        }

        return params;
    }

    function parseHashParams(hash) {
        if (hash == null) {
            return null;
        }

        // 去除#号
        hash = hash.substring(1, hash.length);

        var hash_sp = hash.split('&');
        var params = {};

        for (var i = 0; i < hash_sp.length; i++) {
            var node = hash_sp[i];
            var node_sp = node.split('=');

            if (node_sp[0] == '') {
                continue;
            }

            var key = node_sp[0];
            var val = node_sp[1];

            if (params[key] == null) {
                params[key] = [];
            }

            // url编码解码
            if (val != null) {
                try {
                    val = decodeURIComponent(val);
                } catch (e) {
                }
            }

            params[key].push(val || null);
        }

        // 把没有同名参数的转换为单一值
        for (var keyName in params) {
            if (params[keyName].length == 1) {
                params[keyName] = params[keyName][0];
            }
        }

        return params;
    }

});