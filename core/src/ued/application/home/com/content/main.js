/*
 * main
 *
 * name: xiaojia
 * date: 16/3/24
 */

var Utils = Simple.Utils;

var View = require('./view/main');
var DataStore = require('./store');

module.exports = Simple.Component.extend({

    $constructor: function () {

        var that = this;

        that.$super();

        that.props = {};

        that.state = {
            now: that.getNow(),
            list: [],
            time: 1000,
            count: 1
        };

    },

    getNow: function () {

        var date = new Date();

        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    },

    countAdd: function () {
        this.setState({
            count: this.state.count + 1
        });
    },

    setHTMLHandle: function () {
        this.setHTML('set html');
    },

    willMount: function () {

        var that = this;

        return DataStore.create({
            context: that.app.context
        }).request().done(function (data) {
            that.setState({
                list: Utils.shuffle(data)
            });
        });

    },

    didMount: function () {

        var that = this;

        setInterval(function () {
            that.setState({
                now: that.getNow(),
                list: Utils.shuffle(that.state.list),
                time: that.state.time - 1
            });
        }, 1000);

    },

    name: module.id,

    view: View

});