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

        /**
         * Convert options from String-formatted to Object-formatted if needed
         * (we check in cache first)
         * @type {void|*|{}}
         */
        options = typeof options === "string" ?
            createOptions(options) :
            utils.extend({}, options);

        /**
         * // Flag to know if list is currently firing
         */
        var firing;

        /**
         * Last fire value for non-forgettable lists
         */
        var memory;

        /**
         * Flag to know if list was already fired
         */
        var fired;

        /**
         *  Flag to prevent firing
         */
        var locked;

        /**
         * Actual callback list
         * @type {Array}
         */
        var list = [];

        /**
         * Queue of execution data for repeatable lists
         * @type {Array}
         */
        var queue = [];

        /**
         * Index of currently firing callback (modified by add/remove as needed)
         * @type {number}
         */
        var firingIndex = -1;

        /**
         * Fire callbacks
         */
        var fire = function () {

            // Enforce single-firing
            locked = options.once;

            /**
             * Execute callbacks for all pending executions,
             * respecting firingIndex overrides and runtime changes
             * @type {boolean}
             */
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
                memory = queue.shift();
                while (++firingIndex < list.length) {

                    /**
                     * Run callback and check for early termination
                     */
                    if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {

                        /**
                         * Jump to end and forget the data so .add doesn't re-fire
                         * @type {Number}
                         */
                        firingIndex = list.length;
                        memory = false;

                    }

                }

            }

            /**
             * Forget the data if we're done with it
             */
            if (!options.memory) {
                memory = false;
            }

            firing = false;

            /**
             * Clean up if we're done firing for good
             */
            if (locked) {

                /**
                 * Keep an empty list if we have data for future add calls
                 */
                if (memory) {
                    list = [];
                } else {
                    list = "";
                }
            }

        };

        /**
         * Actual Callbacks object
         * @type {{add: self.add, remove: self.remove, has: self.has, empty: self.empty, disable: self.disable, disabled: self.disabled, lock: self.lock, locked: self.locked, fireWith: self.fireWith, fire: self.fire, fired: self.fired}}
         */
        var self = {

            /**
             * Add a callback or a collection of callbacks to the list
             * @returns {self}
             */
            add: function () {
                if (list) {

                    /**
                     * If we have memory from a past run, we should fire after adding
                     */
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

            /**
             * Remove a callback from the list
             * @returns {self}
             */
            remove: function () {
                utils.each(arguments, function (arg) {
                    var index;
                    while (( index = utils.inArray(arg, list, index) ) > -1) {
                        list.splice(index, 1);
                        if (index <= firingIndex) {
                            firingIndex--;
                        }
                    }
                });
                return this;
            },

            /**
             * Check if a given callback is in the list.
             * If no argument is given, return whether or not list has callbacks attached.
             * @param fn
             * @returns {boolean}
             */
            has: function (fn) {
                return fn ?
                utils.inArray(fn, list) > -1 :
                list.length > 0;
            },

            /**
             * Remove all callbacks from the list
             * @returns {self}
             */
            empty: function () {
                if (list) {
                    list = [];
                }
                return this;
            },

            /**
             * Disable .fire and .add
             * Abort any current/pending executions
             * Clear all callbacks and values
             * @returns {self}
             */
            disable: function () {
                locked = queue = [];
                list = memory = "";
                return this;
            },

            disabled: function () {
                return !list;
            },

            /**
             * Disable .fire
             * Also disable .add unless we have memory (since it would have no effect)
             * Abort any pending executions
             * @returns {self}
             */
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

            /**
             * Call all callbacks with the given context and arguments
             * @param context
             * @param args
             * @returns {self}
             */
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

            /**
             * Call all the callbacks with the given arguments
             * @returns {self}
             */
            fire: function () {
                self.fireWith(this, arguments);
                return this;
            },

            /**
             * To know if the callbacks have already been called at least once
             * @returns {boolean}
             */
            fired: function () {
                return !!fired;
            }

        };

        return self;

    };

    module.exports = Callbacks;

});