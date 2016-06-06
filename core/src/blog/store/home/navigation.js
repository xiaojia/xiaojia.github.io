/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'blog:store/home/navigation'
}, function (require, module, exports, Simple) {

    module.exports = Simple.Store.extend({
        type: 'inline',
        data: [
            {
                title: '文档',
                href: './'
            },
            {
                title: 'simple5',
                target: '_blank',
                href: 'https://github.com/xiaojia/simple5'
            }
            //{
            //    title: '我们',
            //    href: './'
            //}
        ]
    });

    module.exports.setName(module.id);

});