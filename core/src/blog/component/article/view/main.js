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

        template: function(i,a,s,n){"use strict";var e=this,t=(e.$helpers,i.props),c=e.$each,l=(i.$value,i.$index,function(){var i="".concat.apply("",arguments);return 1==this?i:v+=i}),d=e.$escape,v="";return v+='<div class="article">',t?c(t,function(i,a){v+='<div class="item"><div class="title"><a href="">',l.call(!1,d(i.title)),v+='</a><span class="time">2016/10/10</span><span class="name">\u674e\u8fc5</span></div><div class="content">\u5185\u5bb9</div></div>'}):v+='<div class="loading">loading...</div>',v+="</div>",new String(v)},

        style: ["./main"]

    });

});