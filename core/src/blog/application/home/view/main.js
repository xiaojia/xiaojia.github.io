/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/3
 */

Simple.Module({
    name: "blog:application/home/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(n,i,t,e){"use strict";var r=this,o=(r.$helpers,function(){return r.$component(arguments,t,e)}),c=n.props,a="";return a+='<div class="container">',a+=o("Navigation",c.navigation,"undefined"),a+=o("Article",c.article,null),a+="</div>",new String(a)},

        style: ["common:resources/css/basis","./main"]

    });

});