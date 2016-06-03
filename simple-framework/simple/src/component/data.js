/*
 * main
 *
 * name: xiaojia
 * date: 16/3/22
 */

Simple.Module({
    name: 'simple:component/data'
}, function (require, module, exports, Simple) {

    "use strict";

    var utils = Simple.Utils;

    module.exports = {

        /**
         * 强制刷新, 只会调用 didUpdate 回调
         * @param isSync 是否同步刷新
         */
        forceUpdate: function (isSync) {

            var that = this;

            if (that.template) {

                /**
                 * 修改props
                 */
                that.template.forceUpdate({
                    state: that.state,
                    props: that.props
                }, isSync, function () {

                    /**
                     * 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。
                     * 使用该方法可以在组件更新之后操作 DOM 元素。
                     */
                    setTimeout(function () {
                        that.didUpdate(that.state, that.props);
                        that = null;
                        isSync = null;
                    }, 0);

                });

            }

            return that;

        },

        /**
         * 设置props, 此方法为私有方法, 程序会自动调用
         * @param props
         * @param that
         * @private
         */
        setProps: function (props, that) {

            var prevProps = that.props;
            var nextProps = props;

            if (that.template) {

                /**
                 * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
                 * 旧的 props 可以通过 this.getProps 获取到;
                 */
                that.willReceiveProps(nextProps);

                /**
                 * 在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。
                 * 如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。
                 */
                if (that.shouldUpdate(that.state, nextProps) !== false) {

                    /**
                     * 在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。
                     */
                    that.willUpdate(that.state, nextProps);

                    /**
                     * 更新props
                     */
                    that.props = nextProps;

                    /**
                     * 修改props
                     */
                    that.template.setProps(nextProps, false, function () {

                        /**
                         * 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。
                         * 使用该方法可以在组件更新之后操作 DOM 元素。
                         */
                        setTimeout(function () {
                            that.didUpdate(that.state, prevProps);
                            that = null;
                            props = null;
                            prevProps = null;
                            nextProps = null;
                        }, 0);

                    });

                } else {
                    that.props = nextProps;
                }

            } else {
                that.props = nextProps;
            }

            return that;

        },

        /**
         * 设置数据状态, 更新页面
         * @param state 更新后的数据
         * @param isSync 是否为同步形式
         * @param replace 是否替换
         * @returns {exports}
         */
        setState: function (state, isSync, replace) {

            var that = this;

            var prevState = that.state;
            var nextState;

            /**
             * 是否替换
             */
            if (replace) {
                nextState = state;
            } else {
                nextState = utils.extend({}, that.state, state);
            }

            if (that.template) {

                /**
                 * 在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。
                 * 如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。
                 */
                if (that.shouldUpdate(nextState, that.props) !== false) {

                    /**
                     * 在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。
                     */
                    that.willUpdate(nextState, that.props);

                    /**
                     * 更新state
                     */
                    that.state = nextState;

                    /**
                     * 修改state
                     */
                    that.template.setState(nextState, isSync, function () {

                        /**
                         * 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。
                         * 使用该方法可以在组件更新之后操作 DOM 元素。
                         */
                        setTimeout(function () {
                            that.didUpdate(prevState, that.props);
                            that = null;
                            state = null;
                            isSync = null;
                            prevState = null;
                            nextState = null;
                        }, 0);

                    });

                }

            } else {
                that.state = nextState;
            }

            return that;

        },

        /**
         * 同 setState, 但是删除之前所有已存在的 state 键;。
         * @param state
         * @param isSync 是否为同步形式
         */
        replaceState: function (state, isSync) {
            return this.setState(state, isSync, true);
        },

        /**
         * 以HTML字符串形式设置数据状态, 更新页面
         * @param html 需要更新的HTML字符串
         * @param isSync 是否为同步形式
         * @returns {exports}
         */
        setHTML: function (html, isSync) {

            var that = this;

            if (that.template) {

                /**
                 * 在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。
                 * 如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。
                 */
                if (that.shouldUpdate(html, that.state, that.props) !== false) {

                    /**
                     * 在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。
                     */
                    that.willUpdate(html, that.state, that.props);

                    /**
                     * 修改html
                     */
                    that.template.setHTML(html, isSync, function () {

                        /**
                         * 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。
                         * 使用该方法可以在组件更新之后操作 DOM 元素。
                         */
                        setTimeout(function () {
                            that.didUpdate(html, that.state, that.props);
                            that = null;
                            html = null;
                            isSync = null;
                        }, 0);

                    });

                }

            }

            return that;

        },

        /**
         * 获取组件props
         * @returns {*|null}
         */
        getProps: function () {
            return this.props || null;
        },

        /**
         * 获取组件state
         * @returns {*|null}
         */
        getState: function () {
            return this.state || null;
        }

    }

});