/*
 * core
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:core/callbacks/core'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    var rnotwhite = (/\S+/g);

    var createOptions = function (options) {
        var object = {};
        utils.each(options.match(rnotwhite) || [], function (flag) {
            object[flag] = true;
        });
        return object;
    };

    var Callbacks = function (options) {

        options = typeof options === "string" ?
            createOptions(options) :
            utils.extend({}, options);

        var firing,
            memory,
            fired,
            locked,
            list = [],
            queue = [],
            firingIndex = -1,

            fire = function () {
                locked = options.once;
                fired = firing = true;
                for (; queue.length; firingIndex = -1) {
                    memory = queue.shift();
                    while (++firingIndex < list.length) {
                        if (list[firingIndex].apply(memory[0], memory[1]) === false &&
                            options.stopOnFalse) {
                            firingIndex = list.length;
                            memory = false;
                        }
                    }
                }

                if (!options.memory) {
                    memory = false;
                }

                firing = false;

                if (locked) {
                    if (memory) {
                        list = [];
                    } else {
                        list = "";
                    }
                }

            },

            self = {

                add: function () {
                    if (list) {
                        if (memory && !firing) {
                            firingIndex = list.length - 1;
                            queue.push(memory);
                        }
                        (function add(args) {
                            utils.each(args, function (arg) {
                                if (utils.isFunction(arg)) {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && !utils.isString(arg)) {
                                    add(arg);
                                }
                            });
                        })(arguments);
                        if (memory && !firing) {
                            fire();
                        }
                    }
                    return this;
                },

                remove: function () {
                    utils.each(arguments, function (arg) {
                        var index;
                        while (( index = utils.indexOf(arg, list, index) ) > -1) {
                            list.splice(index, 1);
                            if (index <= firingIndex) {
                                firingIndex--;
                            }
                        }
                    });
                    return this;
                },

                has: function (fn) {
                    return fn ? utils.indexOf(fn, list) > -1 : list.length > 0;
                },

                empty: function () {
                    if (list) {
                        list = [];
                    }
                    return this;
                },

                disable: function () {
                    locked = queue = [];
                    list = memory = "";
                    return this;
                },

                disabled: function () {
                    return !list;
                },

                lock: function () {
                    locked = queue = [];
                    if (!memory && !firing) {
                        list = memory = "";
                    }
                    return this;
                },

                locked: function () {
                    return !!locked;
                },

                fireWith: function (context, args) {
                    if (!locked) {
                        args = args || [];
                        args = [context, args.slice ? args.slice() : args];
                        queue.push(args);
                        if (!firing) {
                            fire();
                        }
                    }
                    return this;
                },

                fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                },

                fired: function () {
                    return !!fired;
                }

            };

        return self;

    };

    module.exports = Callbacks;

});