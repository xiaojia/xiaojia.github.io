/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

var View = require('./view/main');

module.exports = Simple.Application.extend({

    $constructor: function () {

        var that = this;

        that.$super();

        that.props = {
            Content: {id: 1}
        };

    },

    name: module.id,

    view: View

});