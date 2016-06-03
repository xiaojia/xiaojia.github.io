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

        template: function(a,i,e,s){"use strict";var l=this,n=(l.$helpers,a.props),c=l.$each,t=(a.$value,a.$index,function(){var a="".concat.apply("",arguments);return 1==this?a:r+=a}),d=l.$escape,r="";return r+='<div class="article">',n?c(n,function(a,i){r+='<div class="item"><div class="title"><a href="">',t.call(!1,d(a.title)),r+='</a><span class="time">',t.call(!1,d(a.time)),r+='</span><span class="name">',t.call(!1,d(a.name)),r+='</span></div><div class="content"><pre>',t.call(!1,a.content),r+='</pre></div><div class="detail"><a href="">\u7ee7\u7eed\u9605\u8bfb</a></div></div>'}):r+='<div class="loading">loading...</div>',r+="</div>",new String(r)},

        style: ["./main"]

    });

});