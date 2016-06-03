/**
 * Created by lixun on 16/5/9.
 */
/*
 * main
 *
 * name: lixun
 * date: 16/5/9
 */

Simple.Module({
    name: 'simple:core/event/main'
}, function (require, module, exports, Simple) {

    "use strict";

    var concertNS = '_Concert';

    var has = Object.hasOwnProperty;
    var slice = Array.prototype.slice;
    var concat = Array.prototype.concat.bind(Array.prototype);
    var NAME_TYPE_ERR = "Event name should be a string";
    var LISTENER_TYPE_ERR = "Event listener should be a function";

    /**
     * Concert is the main object or *module* that you can inject into your own
     * objects to make them observables (also known as *event emitters* or
     * *dispatchers*). You can then listen to and trigger events on that object.
     *
     * ```javascript
     * var Concert = require("concert")
     * function Galaxy() {}
     * for (var name in Concert) Galaxy.prototype[name] = Concert[name]
     *
     * var galaxy = new Galaxy()
     * galaxy.on("secret", console.log)
     * galaxy.trigger("secret", 42)
     * ```
     *
     * You can also create a new instance of `Concert` to get a blank object to
     * use as an *event bus*.
     * ```javascript
     * var Concert = require("concert")
     * var bus = new Concert
     * bus.on("message", console.log)
     * bus.trigger("message", "One giant man to step, one small...")
     * ```
     *
     * If you need, you can also rename any `Concert`'s function by just assigning
     * them to new names on your object:
     * ```javascript
     * obj.addEventListener = Concert.on
     * obj.emit = Concert.trigger
     * obj.removeEventListener = Concert.off
     * ```
     *
     * @class Concert
     * @constructor
     */
    function Concert() {
    }

    /**
     * Add a `listener` for `event`.
     * Optionally specify the listener's `this` value. Defaults to the object
     * the event was triggered on when left undefined.
     * Optionally specify additional arguments to be passed to the listener.
     * Returns self.
     *
     * You can also specify **multiple events** at once by passing an object whose
     * keys are event names and values functions.  Pass the optional `this` then as
     * the 2nd parameter.
     *
     * Listen to the special `all` event to be called when any event is triggered:
     * ```javascript
     * obj.on("all", function(event) {})
     * ```
     *
     * The listener will be called with any arguments passed to
     * [`trigger`](#Concert.trigger).
     *
     * @example
     * music.on("cowbell", function() { console.log("Cluck!") })
     * collection.on({add: view.onAdd, remove: view.onRemove}, view)
     * model.on("change:name", view.onChange, view, "name")
     *
     * @static
     * @method on
     * @param event
     * @param listener
     * @param [thisArg]
     * @param [arguments...]
     */
    Concert.prototype.on = function on(name, fn, thisArg) {

        if (name == null) {
            throw new TypeError(NAME_TYPE_ERR);
        }

        if (unpack(on, this, arguments)) {
            return this;
        }

        if (fn == null) {
            throw new TypeError(LISTENER_TYPE_ERR);
        }

        var events = this[concertNS];

        if (events == null || !has.call(this, concertNS)) {
            events = create(this, concertNS, events);
        }

        var fns = events[name];

        if (fns == null) {
            fns = events[name] = [];
        } else if (!has.call(events, name)) {
            fns = events[name] = fns.slice();
        }

        fns.push(slice.call(arguments, 1));

        return this;

    };

    /**
     * Like [`on`](#Concert.on), but the listener is guaranteed to be called only
     * once.
     * Returns self.
     *
     * @static
     * @method once
     * @param event
     * @param listener
     * @param [thisArg]
     * @param [arguments...]
     */
    Concert.prototype.once = function once(name, fn, thisArg) {

        if (name == null) {
            throw new TypeError(NAME_TYPE_ERR);
        }

        if (unpack(once, this, arguments)) {
            return this;
        }

        if (fn == null) {
            throw new TypeError(LISTENER_TYPE_ERR);
        }

        function fnOnce() {
            "use strict";
            Concert.prototype.off.call(this, name, fn);
            fn.apply(thisArg === void 0 ? this : thisArg, arguments)
        }

        fnOnce.__func = fn;
        fnOnce.__this = thisArg;

        var args = [name, fnOnce, void 0];

        if (arguments.length > 3) {
            args.push.apply(args, slice.call(arguments, 3));
        }

        return Concert.prototype.on.apply(this, args);

    };

    /**
     * Remove previously added listeners by event name, by listener, by `thisArg`
     * or by any combination.
     * Returns self.
     *
     * You can also specify **multiple events** at once by passing an object whose
     * keys are event names and values functions.  Pass `thisArg` then as the 2nd
     * parameter.
     *
     * @example
     * // Remove all listeners:
     * obj.off()
     * // Remove listeners listening to event "foo":
     * obj.off("foo")
     * // Remove listeners fn of event "foo":
     * obj.off("foo", fn)
     * // Remove listener fn bound to thisArg listening to event "foo":
     * obj.off("foo", fn, thisArg)
     * // Remove all listeners bound to thisArg:
     * obj.off(null, null, thisArg)
     * // Remove all listeners fn listening to any event:
     * obj.off(null, fn)
     * // Remove multiple listeners together:
     * obj.off({add: view.onAdd, remove: view.onRemove}, thisArg)
     *
     * @static
     * @method off
     * @param event
     * @param listener
     * @param [thisArg]
     */
    Concert.prototype.off = function off(name, fn, thisArg) {

        var events = this[concertNS];

        if (events == null) {
            return this;
        }

        if (unpack(off, this, arguments)) {
            return this;
        }

        if (fn == null && thisArg === void 0) {

            if (name == null) {
                define(this, concertNS, null);
            } else if (events[name] != null) {

                if (!has.call(this, concertNS)) {
                    events = create(this, concertNS, events);
                } else {
                    delete events[name];
                }

                if (name in events) {
                    events[name] = null;
                }

            }

        } else {

            if (!has.call(this, concertNS)) {
                events = create(this, concertNS, events);
            }

            if (name != null) {
                filter(events, name, fn, thisArg);
            } else {
                for (name in events) {
                    filter(events, name, fn, thisArg);
                }
            }

        }

        return this;

    };

    /**
     * Trigger `event` and optionally pass any extra arguments to the listeners.
     * Returns self.
     *
     * Every event triggering also automatically triggers an `all` event with the
     * event name prepended to other arguments.
     *
     * @example
     * obj.trigger("change", 42, {previous: 69})
     *
     * @static
     * @method trigger
     * @param event
     * @param [arguments...]
     */
    Concert.prototype.trigger = function trigger(name) {

        var events = this[concertNS];

        if (events == null) {
            return this;
        }

        if (events[name] != null) {
            apply(events[name], this, slice.call(arguments, 1));
        }

        if (events.all != null) {
            apply(events.all, this, arguments);
        }

        return this;

    };

    Concert.on = Concert.prototype.on;
    Concert.once = Concert.prototype.once;
    Concert.off = Concert.prototype.off;
    Concert.trigger = Concert.prototype.trigger;

    function unpack(on, self, args) {

        var obj = args[0];

        if (obj == null || typeof obj != "object") {
            return false;
        }

        var name;

        if (args.length > 2) {
            var argsArray = slice.call(args, 1);
            for (name in obj) on.apply(self, concat(name, obj[name], argsArray))
        } else {
            for (name in obj) {
                on.call(self, name, obj[name], args[1]);
            }
        }

        return true;

    }

    function define(obj, name, value) {
        Object.defineProperty(obj, name, {value: value, configurable: 1, writable: 1});
        return value;
    }

    function create(obj, name, prototype) {
        return define(obj, name, Object.create(prototype || null));
    }

    function filter(events, name, fn, thisArg) {

        var fns = events[name];

        if (fns == null) {
            return;
        }

        fns = fns.filter(function (args) {

            if (fn != null && !hasFunction(args, fn)) {
                return true;
            }

            if (thisArg !== void 0 && !hasThis(args, thisArg)) {
                return true;
            }

            return false;

        });

        if (fns.length == 0) {
            delete events[name];
            if (name in events) {
                events[name] = null;
            }
        } else {
            events[name] = fns;
        }

    }

    function hasFunction(args, fn) {
        return args[0] === fn || args[0].__func === fn;
    }

    function hasThis(args, thisArg) {
        return (args[0].__this || args[1]) === thisArg;
    }

    function apply(fns, thisArg, args) {

        for (var i = 0, l = fns.length; i < l; ++i) {

            var fn = fns[i];

            var argsArray = fn.length > 2 ? fn.slice(2) : null;

            if (argsArray == null) {
                argsArray = args;
            } else if (args.length > 0) {
                argsArray.push.apply(argsArray, args);
            }

            /**
             * simple
             */
            if (fn[0].apply(fn[1] === void 0 ? thisArg : fn[1], argsArray) === false) {
                if (argsArray) {
                    var e = argsArray[0];
                    if (e && e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }

        }
    }

    module.exports = Concert;

});