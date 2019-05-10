/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

var View = require('./view/main');

module.exports = Simple.Component.extend({

    $constructor: function () {

        var that = this;

        that.$super();

    },

    name: module.id,

    view: View

});