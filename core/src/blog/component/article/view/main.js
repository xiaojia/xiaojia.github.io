/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/3
 */

Simple.Module({
    name: "blog:component/article/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(i,a,e,t){"use strict";var c=this,l=(c.$helpers,i.props),n=c.$each,s=(i.$value,i.$index,function(){var i="".concat.apply("",arguments);return 1==this?i:r+=i}),d=c.$escape,r="";return r+='<div class="article">',l?n(l,function(i,a){r+='<div class="item"><div class="title"><a href="">',s.call(!1,d(i.title)),r+="</a></div></div>"}):r+='<div class="loading">loading...</div>',r+="</div>",new String(r)},

        style: ["./main"]

    });

});