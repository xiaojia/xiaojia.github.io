/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

Simple.Module({
    name: 'blog:component/article/main',
    require: [
        './view/main'
    ]
}, function (require, module, exports, Simple) {

    module.exports = Simple.Component.extend({

        name: module.id,

        view: require('./view/main')

    });

    module.exports.setName(module.id);

});