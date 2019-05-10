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

        that.props = {
            name: '按钮',
            click: function () { }
        };

    },

    didMount: function () {

        var that = this;

        that.event.on('btn', 'click', function () {
            that.props.click.apply(this, arguments);
        });

    },

    name: module.id,

    view: View

});