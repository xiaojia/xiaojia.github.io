/*
 * main
 *
 * name: xiaojia
 * date: 16/4/29
 */

Simple.Module({
    name: 'blog:router/main',
    require: [
        '../application/home/main'
    ]
}, function (require, module, exports, Simple) {

    var router = Simple.Router;

    var home = function (params, context) {
        require('../application/home/main').create({
            params: params
        }).render(context);
    };

    router.use('/', home);
    router.use('/index.html', home);

});