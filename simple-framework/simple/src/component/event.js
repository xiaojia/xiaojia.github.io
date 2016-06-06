/*
 * event
 *
 * name: lixun
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:component/event',
    require: [
        '../core/event/main'
    ]
}, function (require, module, exports, Simple) {

    "use strict";

    var comID = Simple.Module.config.comID;
    var Concert = require('../core/event/main');
    var strSimpleEventsNS = 'SimpleEvents';

    function extendEventCore(dom) {
        dom[strSimpleEventsNS] = dom[strSimpleEventsNS] || {};

        for (var name in Concert) {
            dom[strSimpleEventsNS][name] = Concert[name];
        }
    }

    function bindEventAndListen(type, dom, event, handle) {
        var itself = this.itself;
        var ref = getRefName(dom);
        var eventObj = getEventObj(event);
        extendEventCore(itself);

        if (type == 'on') {
            itself[strSimpleEventsNS].on(evalEventName(ref, event), handle);
        }
        else if (type == 'once') {
            itself[strSimpleEventsNS].once(evalEventName(ref, event), handle);
        }

        storeEventInfo(itself, ref, event);

        if (!isListener(itself, eventObj.name)) {
            itself[strSimpleEventsNS][evalListenerName(eventObj.name)] = true;

            var _this = this;

            if (itself.addEventListener) {
                itself.addEventListener(eventObj.name, function (e) {
                    // 模块不再往上冒泡
                    // ie9及以上支持w3c标准
                    e.stopPropagation();

                    _this.trigger(eventObj.name, e);

                }, false);
            } else {
                // ie8及以下使用attachEvent
                itself.attachEvent('on' + eventObj.name, function (e) {
                    // 模块不再往上冒泡
                    // IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;

                    _this.trigger(eventObj.name, e);

                });
            }
        }
    }

    function getRefName(dom) {
        if (typeof dom == 'string') {
            return dom;
        }

        return dom.getAttribute('ref');
    }

    function getRefTarget(dom) {
        if (dom && dom.nodeType === 1) {
            if (dom.getAttribute('ref') != null) {
                return dom;
            }
            return getRefTarget(dom.parentNode);
        }
    }

    function getItself(dom) {
        if (dom && dom.nodeType === 1) {
            if (dom.getAttribute(comID) != null) {
                return dom;
            }
            if (dom.parentNode != null) {
                return getItself(dom.parentNode);
            }
        }
    }

    function isListener(dom, event) {
        return (dom[strSimpleEventsNS][evalListenerName(event)] != null) ? true : false;
    }

    function getParents(dom, itself, result) {
        if (itself == null) {
            itself = getItself(dom);
            result = [];
        }

        if (dom != itself) {
            result.push(dom.parentNode);

            getParents(dom.parentNode, itself, result)
        }

        return result;
    }

    function evalEventName(ref, event) {
        return ref + '_' + event;
    }

    function evalListenerName(event) {
        return '_is_listener_' + event;
    }

    function evalStopPropagationName() {
        return '_stop_propagation';
    }

    function storeEventInfo(dom, ref, event) {
        var eventObj = getEventObj(event);
        var objDomEventNS = dom[strSimpleEventsNS];

        objDomEventNS._events = objDomEventNS._events || {};
        objDomEventNS._events[ref] = objDomEventNS._events[ref] || {};
        objDomEventNS._events[ref][eventObj.name] = objDomEventNS._events[ref][eventObj.name] || {};
        if (eventObj.namespace != null) {
            objDomEventNS._events[ref][eventObj.name][eventObj.namespace] = eventObj.namespace;
        }
    }

    function getEventsInfo(dom) {
        var itself = getItself(dom);
        var ref = getRefName(dom);
        var objDomEventNS = itself[strSimpleEventsNS];
        var eventsInfo = {};

        var domEvents = objDomEventNS._events[ref];
        for (var event in domEvents) {
            eventsInfo[event] = {};

            var namespaces = domEvents[event];
            for (var namespace in namespaces) {
                eventsInfo[event][namespace] = namespace;
            }
        }

        return eventsInfo;
    }

    function getEventObj(event) {
        if (event == null) {
            return null;
        }

        var eventObj = {
            name: '',
            namespace: null
        };

        var event_sp = event.split('.');
        if (event_sp.length == 2) {
            eventObj.name = event_sp[0];
            eventObj.namespace = event_sp[1];
        } else {
            eventObj.name = event;
        }

        return eventObj;
    }

    function getEventNamespaces(itself, ref, eventName) {
        var objDomEventNS = itself[strSimpleEventsNS];
        var namespaces = [];

        if (objDomEventNS._events[ref] == null || objDomEventNS._events[ref][eventName] == null) {
            return namespaces;
        }

        var event = objDomEventNS._events[ref][eventName];
        for (var namespace in event) {
            namespaces.push(namespace);
        }

        return namespaces;
    }

    function triggerEventsByName(itself, ref, eventName, e) {
        if (ref == null) {
            return;
        }

        var namespaces = getEventNamespaces(itself, ref, eventName);

        itself[strSimpleEventsNS].trigger(evalEventName(ref, eventName), e);

        if (namespaces.length > 0) {
            for (var i = 0; i < namespaces.length; i++) {
                itself[strSimpleEventsNS].trigger(evalEventName(ref, eventName + '.' + namespaces[i]), e);
            }
        }
    }

    module.exports = Simple.Object.extend({

        on: function (dom, event, handle) {
            bindEventAndListen.call(this, 'on', dom, event, handle);
        },
        once: function (dom, event, handle) {
            bindEventAndListen.call(this, 'once', dom, event, handle);
        },
        trigger: function (event, e) {
            var _target = e.srcElement ? e.srcElement : e.target;

            // 添加refTarget属性到e上
            e.refTarget = getRefTarget(_target);
            // 添加refTarget属性到e上 END

            // 重写标准e.stopPropagation()阻止冒泡
            // 支持自定义事件冒泡阻止
            if (e && e.stopPropagation) {
                // 支持W3C的stopPropagation()方法
                var stopPropagation = e.stopPropagation;
                e.stopPropagation = function () {
                    stopPropagation.call(this);

                    this.target[strSimpleEventsNS] = this.target[strSimpleEventsNS] || {};
                    this.target[strSimpleEventsNS][evalStopPropagationName()] = true;
                };
            } else {
                // IE的方式来取消事件冒泡
                e.stopPropagation = function () {
                    window.event.cancelBubble = true;

                    this.srcElement[strSimpleEventsNS] = this.srcElement[strSimpleEventsNS] || {};
                    this.srcElement[strSimpleEventsNS][evalStopPropagationName()] = true;
                };

                // IE支持w3c阻止默认事件写法
                e.preventDefault = function () {
                    window.event.returnValue = false;
                }
            }

            var checkStopPropagation = function (e) {
                var _target = e.srcElement ? e.srcElement : e.target;
                _target[strSimpleEventsNS] = _target[strSimpleEventsNS] || {};

                if (_target[strSimpleEventsNS][evalStopPropagationName()] == true) {
                    return true;
                }

                return false;
            };

            var cleanStopPropagationMark = function (e) {
                var _target = e.srcElement ? e.srcElement : e.target;
                _target[strSimpleEventsNS] = _target[strSimpleEventsNS] || {};

                _target[strSimpleEventsNS][evalStopPropagationName()] = false;
            };
            // 重写标准e.stopPropagation() END

            var itself = getItself(_target);
            var ref = getRefName(_target);

            triggerEventsByName(itself, ref, event, e);

            // 处理冒泡
            var parents = getParents(_target);

            for (var i = 0; i < parents.length; i++) {
                if (checkStopPropagation(e)) {
                    break;
                }

                var pRef = getRefName(parents[i]);
                if (pRef == null) {
                    continue;
                }

                triggerEventsByName(itself, pRef, event, e);
            }

            cleanStopPropagationMark(e);
        },
        off: function (dom, event) {
            var itself = getItself(dom);
            var ref = getRefName(dom);
            var eventsInfo = getEventsInfo(dom);
            var eventObj = getEventObj(event);

            var bindEventNames = [];
            for (var eventName in eventsInfo) {
                if (eventObj == null) {
                    bindEventNames.push(eventName);

                    for (var namespace in eventsInfo[eventName]) {
                        bindEventNames.push(eventName + '.' + namespace);
                    }
                }

                if (eventObj != null && eventObj.name == eventName) {
                    if (eventObj.namespace == null) {
                        bindEventNames.push(eventName);
                    }

                    for (var namespace in eventsInfo[eventName]) {
                        if (eventObj.namespace == null) {
                            bindEventNames.push(eventName + '.' + namespace);
                        }

                        if (eventObj.namespace != null && eventObj.namespace == namespace) {
                            bindEventNames.push(eventName + '.' + namespace);
                        }
                    }
                }
            }

            for (var i = 0; i < bindEventNames.length; i++) {
                itself[strSimpleEventsNS].off(evalEventName(ref, bindEventNames[i]));
            }
        }

    });

});