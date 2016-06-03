/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/3
 */

Simple.Module({
    name: "blog:component/navigation/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(i,l,a,e){"use strict";var n=this,s=(n.$helpers,n.$each),t=i.props,c=(i.$value,i.$index,function(){var i="".concat.apply("",arguments);return 1==this?i:r+=i}),r="";return r+='<div class="navigation"><div class="title"><a href="./">ued<span>.life</span></a></div><div class="menu"><ul class="list-unstyled">',s(t,function(i,l){r+='<li><a href="',c.call(!1,i.href),r+='">',c.call(!1,i.title),r+="</a></li>"}),r+="</ul></div></div>",new String(r)},

        style: ["./main"]

    });

});