/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

Simple.Module({
    name: 'blog:application/detail/com',
    require: [
        '../../component/navigation/main',
        '../../component/detail/main'
    ]
}, function (require, module, exports, Simple) {

    module.exports = {
        Navigation: require('../../component/navigation/main'),
        Detail: require('../../component/detail/main')
    };

});