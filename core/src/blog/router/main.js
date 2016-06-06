/*
 * main
 *
 * name: xiaojia
 * date: 16/4/29
 */

Simple.Module({
    name: 'blog:router/main',
    require: [
        '../application/home/main',
        '../application/detail/main'
    ]
}, function (require, module, exports, Simple) {

    var router = Simple.Router;

    var homeHandle = function (params, context) {

        if (params.hash && params.hash.id) {
            require('../application/detail/main').create({
                params: params
            }).render(context);
        } else {
            require('../application/home/main').create({
                params: params
            }).render(context);
        }
    };

    /**
     * 监听hash变化
     */
    if (Simple.platform.browser) {
        window.addEventListener('hashchange', function () {
            var urlObj = router.parse(location.href, true);
            homeHandle({
                hash: urlObj.hash,
                search: urlObj.search,
                path: null
            });
        }, false);
    }

    router.use('/', homeHandle);
    router.use('/index.html', homeHandle);

});