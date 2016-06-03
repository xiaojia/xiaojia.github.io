/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

Simple.Module({
    name: 'blog:application/home/action'
}, function (require, module, exports, Simple) {

    module.exports = function (that) {

        var stores = that.stores;

        that.on('delete', function () {

            stores.homeList.data.pop();

            that.props = {
                header: stores.homeList.data
            };

            that.forceUpdate();

        });

        that.on('add', function (e) {

            stores.homeList.data.push({
                id: 1,
                fullname: e.refTarget.innerHTML
            });

            that.replaceProps({
                header: stores.homeList.data
            });

        });

    }

});