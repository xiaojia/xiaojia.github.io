/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/6
 */

Simple.Module({
    name: "blog:application/detail/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(n,i,t,e){"use strict";var o=this,r=(o.$helpers,function(){return o.$component(arguments,t,e)}),a=n.props,c="";return c+='<div class="container">',c+=r("Navigation",a.navigation,"undefined"),c+=r("Detail",a.detail,null),c+="</div>",new String(c)},

        style: ["common:resources/css/basis","./main"]

    });

});