/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'blog:store/home/article'
}, function (require, module, exports, Simple) {

    module.exports = Simple.Store.extend({
        url: 'article/list.json'
    });

    module.exports.setName(module.id);

});