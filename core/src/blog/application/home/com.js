/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

Simple.Module({
    name: 'blog:application/home/com',
    require: [
        '../../component/navigation/main',
        '../../component/article/main'
    ]
}, function (require, module, exports, Simple) {

    module.exports = {
        Navigation: require('../../component/navigation/main'),
        Article: require('../../component/article/main')
    };

});