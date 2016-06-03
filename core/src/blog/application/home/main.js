/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

Simple.Module({
    name: 'blog:application/home/main',
    require: [
        './com',
        './action',
        './view/main',
        'blog:store/home/navigation',
        'blog:store/home/article'
    ]
}, function (require, module, exports, Simple) {

    var action = require('./action');

    module.exports = Simple.Application.extend({

        $constructor: function () {

            var that = this;

            that.$super();
            that.component = require('./com');

            that.props = {
                navigation: [],
                article: []
            };

            action(that);

        },

        stores: {
            navigation: require('blog:store/home/navigation').create(),
            article: require('blog:store/home/article').create()
        },

        willMount: function (dtd) {

            var that = this;
            var stores = that.stores;

            stores.navigation.request().done(function (navigation) {

                that.props = {
                    navigation: navigation
                };

                dtd.resolve();

            }).fail(function () {
                dtd.reject();
            });

        },

        didMount: function () {

            var that = this;
            var stores = that.stores;

            stores.article.request().done(function (article) {
                console.log(article)
                that.setProps({
                    article: article
                });

            });

        },

        name: module.id,

        view: require('./view/main')

    });

    module.exports.setName(module.id);

});