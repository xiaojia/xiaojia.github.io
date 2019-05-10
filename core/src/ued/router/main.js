/*
 * main
 *
 * name: xiaojia
 * date: 16/4/29
 */

var Router = Simple.Router;

Router.use(['/', './index.html'], function (params, context) {
    return require.async('ued:application/home/main', function (app) {
        app.create({
            params: params,
            context: context
        }).render();
    });
});